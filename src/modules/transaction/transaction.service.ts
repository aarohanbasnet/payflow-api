import { tr } from "zod/locales";
import{ prisma } from "../../config/prisma.js";
import { Prisma, UtilityType } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/error.js";
import { generateReferenceNumber } from "../../utils/referenceNumber.js";
import { checkDailyTransactionLimit } from "../services/limit.service.js";
import { verifyUserMpin } from "../services/verify-mpin.service.js";
import { TransferInput, UtilityInput } from "./transaction.schema.js";
import { maskPhone } from "../../utils/mask.js";

type TransferServiceInput = TransferInput & {
    userId : string
}

type UtilityServiceInput = UtilityInput & {
    userId : string
}

const utilityVendors = {
    ELECTRICITY :  ["NEA"],
    WATER : ["KUKL"],
    INTERNET : ["WORLDLINK", "VIANET", "SUBISU"],
    MOBILE_TOPUP : ["NTC", "NCELL"],
    TV : ["DISHHOME"]
}

export const transferAmount = async( input : TransferServiceInput)=> {

    const { identifierType, identifier, amount, remarks, mpin, userId } = input;

    await verifyUserMpin(userId, mpin);

    const sender = await prisma.user.findUnique({
        where : { id : userId },
        select : {
            phone : true,
            username : true,
            account : {
                select : {
                    id : true,
                    accountNumber : true,
                    balance : true,
                },
            },
        },
    });

    if(!sender || !sender.account){
        throw new AppError("Sender account not found", 404);
    }

    const senderAccountId = sender.account.id;

    let targetUserId : string | null = null;
    let targetAccountId : string | null = null;
    let targetName : string | null = null;
    let targetAccountNumber : string | null = null;

    if(identifierType === "USERNAME"){

        const receiver = await prisma.user.findUnique({
            where : { username :  identifier},
            select :{ 
                id : true, 
                name : true,
                account : {
                    select : {
                        id : true,
                        accountNumber : true,
                    },
                },
            },
        });

        if(receiver){
            targetUserId = receiver.id;
            targetAccountId = receiver.account?.id || null;
            targetAccountNumber = receiver.account?.accountNumber || null;
            targetName = receiver.name || null;
        }
    } else if (identifierType === "PHONE"){
        const receiver = await prisma.user.findUnique({
            where : { phone : identifier},
            select : {
                id : true,
                name : true,
                account : {
                    select : {
                        id : true,
                        accountNumber : true,
                    },
                },
            },
        });

        if(receiver){
            targetUserId = receiver.id;
            targetAccountId = receiver.account?.id || null;
            targetAccountNumber = receiver.account?.accountNumber || null;
            targetName = receiver.name || null;
        }
    } else if (identifierType === "ACCOUNT_NUMBER"){
        const receiverAccount = await prisma.account.findUnique({
            where : { accountNumber : identifier},
            select : {
                id : true, 
                userId : true,
                accountNumber : true,
                user : {
                    select : { name : true },
                }
            }
        });

        if(receiverAccount){
            targetUserId = receiverAccount.userId;
            targetAccountId = receiverAccount.id;
            targetAccountNumber = receiverAccount.accountNumber;
            targetName = receiverAccount.user.name;
        }
    }

    if(!targetAccountId || !targetUserId) {
        throw new AppError("Receiver account or user does not exist", 404)
    }

    if(targetUserId === userId){
        throw new AppError("You cannot transfer money to yourself", 400);
    }

    if(targetAccountId === sender.account.id){
        throw new AppError("You cannot transfer money to yourself", 400)
    }

    await checkDailyTransactionLimit(sender.account.id, amount);
    const referenceNumber = generateReferenceNumber();

    const transactionRecord = await prisma.$transaction(
        async (tx) => {

            const currentSenderAccount = await tx.account.findUnique({
                where : { id : senderAccountId },
                select : { balance : true }
            });

             const currentBalance = currentSenderAccount?.balance?.toNumber() ?? 0;

            if(currentBalance < amount){
            throw new AppError("Insufficient acount balance", 400);
            }

            await tx.account.update({
                where : { id : senderAccountId},
                data : {
                    balance : { decrement : amount },
                }
            });

            await tx.account.update({
                where : { id : targetAccountId },
                data : {
                    balance : { increment : amount }
                },
            });

            return await tx.transaction.create({
                data : {
                    reference : referenceNumber,
                    type : "TRANSFER",
                    senderAccount : {  connect :  { id : senderAccountId}},
                    receiverAccount : { connect : { id : targetAccountId}},
                    amount : new Prisma.Decimal(amount),
                    remarks : remarks || "Fund transfer",
                    status : "SUCCESS",
                }
            });
        });

        return {
            data  :{
                transactionId : transactionRecord.id,
                referenceNumber : transactionRecord.reference,

                sender : {
                    accountNumber : sender.account.accountNumber,
                    name : sender.username,
                },

                receiver : {
                    accountNumber : targetAccountNumber,
                    name : targetName,
                },

                amount : transactionRecord.amount,
                remarks : transactionRecord.remarks,
                status : transactionRecord.status,
                createdAt : transactionRecord.createdAt,
            },
        };
};

export const utilityPayment = async ( input : UtilityServiceInput )=> {
    const {utilityType, vendor, amount, mpin, userId} = input;

    await verifyUserMpin(userId, mpin);

    const initiator = await prisma.user.findUnique({
        where : { id : userId },
        select : {
            name : true,
            phone : true,
            account : {
                select : {
                    id : true,
                    accountNumber : true,
                },
            },  
        },
    });

    if(!initiator || !initiator.account){
        throw new AppError("Account not found", 404);
    }

    const initiatorAccountId = initiator.account.id;

    const vendors = utilityVendors[utilityType];
    if(!vendors.includes(vendor)){
        throw new AppError(`${vendor} is not available for ${utilityType}`, 400)
    }

    await checkDailyTransactionLimit(initiatorAccountId, amount);
    const referenceNumber = generateReferenceNumber();

    const transactionRecord = await prisma.$transaction(

        async (tx) => {
            const initiatorAccount = await tx.account.findUnique({
                where : { id : initiatorAccountId },
                select : { balance : true },
            });

            const currentBalance = initiatorAccount?.balance.toNumber() ?? 0;
            
            if( currentBalance < amount ){
                 throw new AppError("Insufficient acount balance", 400);
            }

            await tx.account.update({
                where : { id : initiatorAccountId},
                data : { 
                    balance : { decrement : amount},
                },
                select : { balance : true }
            });

            return await tx.transaction.create({
                data : {
                    reference : referenceNumber,
                    type : "UTILITY_PAYMENT",
                    utilityType : utilityType,
                    senderAccount : {
                        connect : { id : initiatorAccountId } },
                    amount : new Prisma.Decimal(amount),
                    remarks : `${utilityType} bill payment to ${vendor}`,
                    status : "SUCCESS"
                }
            });
        });

        return {
            data : {
                transactionId : transactionRecord.id,
                referenceNumber : transactionRecord.reference,
                initiator : {
                    name : initiator.name,
                    phone : maskPhone(initiator.phone),
                },
                utility : {
                    type : transactionRecord.utilityType,
                    vendor : vendor,
                },
                amount : transactionRecord.amount,
                remarks : transactionRecord.remarks,
                status : transactionRecord.status,
                createdAt : transactionRecord.createdAt,
            }
        }

}
