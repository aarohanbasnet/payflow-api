import { prisma } from "../src/config/prisma.js";
import { hash } from "../src/utils/hash.js";
import { generateAccountNumber } from "../src/utils/accountNumber.js";
import { generateReferenceNumber } from "../src/utils/referenceNumber.js";

const DEMO_USERS = {
    alice: {
        name: "Aarohan Demo",
        username: "aarohan.demo",
        email: "aarohan.demo@payflow.test",
        phone: "9800000001",
        password: "Demo@1234",
        mpin: "1234",
        startingBalance: 5000,
    },
    bob: {
        name: "Sita Demo",
        username: "sita.demo",
        email: "sita.demo@payflow.test",
        phone: "9800000002",
        password: "Demo@1234",
        mpin: "1234",
        startingBalance: 2000,
    },
};

async function main() {
    console.log("Seeding demo data...");

    // Clean up any previous run of this exact seed, so it's safe to re-run
    // (deleting the User cascades to Account, OTP, refreshToken, and
    // any Transaction rows pointing at those accounts get their FK set null).
    await prisma.user.deleteMany({
        where: { email: { in: [DEMO_USERS.alice.email, DEMO_USERS.bob.email] } },
    });

    const alice = await prisma.user.create({
        data: {
            name: DEMO_USERS.alice.name,
            username: DEMO_USERS.alice.username,
            email: DEMO_USERS.alice.email,
            phone: DEMO_USERS.alice.phone,
            password: await hash(DEMO_USERS.alice.password),
            mpin: await hash(DEMO_USERS.alice.mpin),
            isVerified: true, // skip the OTP step — this is seed data, not a real signup
            account: {
                create: {
                    accountNumber: generateAccountNumber(),
                    balance: DEMO_USERS.alice.startingBalance,
                },
            },
        },
        include: { account: true },
    });

    const bob = await prisma.user.create({
        data: {
            name: DEMO_USERS.bob.name,
            username: DEMO_USERS.bob.username,
            email: DEMO_USERS.bob.email,
            phone: DEMO_USERS.bob.phone,
            password: await hash(DEMO_USERS.bob.password),
            mpin: await hash(DEMO_USERS.bob.mpin),
            isVerified: true,
            account: {
                create: {
                    accountNumber: generateAccountNumber(),
                    balance: DEMO_USERS.bob.startingBalance,
                },
            },
        },
        include: { account: true },
    });

    if (!alice.account || !bob.account) {
        throw new Error("Seed accounts failed to create — aborting.");
    }

    // A P2P transfer: Aarohan -> Sita, 500
    const transferAmount = 500;
    await prisma.$transaction([
        prisma.account.update({
            where: { id: alice.account.id },
            data: { balance: { decrement: transferAmount } },
        }),
        prisma.account.update({
            where: { id: bob.account.id },
            data: { balance: { increment: transferAmount } },
        }),
        prisma.transaction.create({
            data: {
                reference: generateReferenceNumber(),
                amount: transferAmount,
                type: "TRANSFER",
                status: "SUCCESS",
                remarks: "Demo P2P transfer",
                senderAccountId: alice.account.id,
                receiverAccountId: bob.account.id,
            },
        }),
    ]);

    // A utility bill payment: Aarohan pays an electricity bill, 300
    const utilityAmount = 300;
    await prisma.$transaction([
        prisma.account.update({
            where: { id: alice.account.id },
            data: { balance: { decrement: utilityAmount } },
        }),
        prisma.transaction.create({
            data: {
                reference: generateReferenceNumber(),
                amount: utilityAmount,
                type: "UTILITY_PAYMENT",
                status: "SUCCESS",
                utilityType: "ELECTRICITY",
                vendor: "NEA",
                remarks: "Demo electricity bill",
                senderAccountId: alice.account.id,
            },
        }),
    ]);

    console.log("\nSeed complete. Demo credentials:\n");
    console.table([
        { name: DEMO_USERS.alice.name, identifier: DEMO_USERS.alice.email, password: DEMO_USERS.alice.password, mpin: DEMO_USERS.alice.mpin },
        { name: DEMO_USERS.bob.name, identifier: DEMO_USERS.bob.email, password: DEMO_USERS.bob.password, mpin: DEMO_USERS.bob.mpin },
    ]);
    console.log("Aarohan sent 500 to Sita, then paid a 300 electricity bill.");
}

main()
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });