import{ prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/error.js";
import { generateReferenceNumber } from "../../utils/referenceNumber.js";
import { checkDailyTransactionLimit } from "../services/limit.service.js";
import { verifyUserMpin } from "../services/verify-mpin.service.js";
import { GetTransactionInput, TransferInput, UtilityInput } from "./transaction.schema.js";
import { maskPhone } from "../../utils/mask.js";
import { sendTransactionAlertEmail } from "../services/email/email.service.js";

type TransferServiceInput = TransferInput & {
    userId : string
}

type UtilityServiceInput = UtilityInput & {
    userId : string
}

type GetTransactionServiceInput = GetTransactionInput & {
    userId : string
}

const utilityVendors = {
    ELECTRICITY :  ["NEA"],
    WATER : ["KUKL"],
    INTERNET : ["WORLDLINK", "VIANET", "SUBISU"],
    MOBILE_TOPUP : ["NTC", "NCELL"],
    TV : ["DISHHOME"]
}

const TRANSACTION_HISTORY_DAYS = 7;

export const transferAmount = async( input : TransferServiceInput)=> {

    const { identifierType, identifier, amount, remarks, mpin, userId } = input;

    await verifyUserMpin(userId, mpin);

    const sender = await prisma.user.findUnique({
        where : { id : userId },
        select : {
            name : true,
            phone : true,
            username : true,
            email : true,
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
    const senderEmailAddress = sender.email;

    let targetUserId : string | null = null;
    let targetAccountId : string | null = null;
    let targetName : string | null = null;
    let targetAccountNumber : string | null = null;
    let targetEmailAddress : string | null = null;

    if(identifierType === "USERNAME"){

        const receiver = await prisma.user.findUnique({
            where : { username :  identifier},
            select :{ 
                id : true, 
                name : true,
                email : true,
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
            targetEmailAddress = receiver.email || null;
        }
    } else if (identifierType === "PHONE"){
        const receiver = await prisma.user.findUnique({
            where : { phone : identifier},
            select : {
                id : true,
                name : true,
                email : true,
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
            targetEmailAddress = receiver.email || null;
        }

    } else if (identifierType === "ACCOUNT_NUMBER"){
        const receiverAccount = await prisma.account.findUnique({
            where : { accountNumber : identifier},
            select : {
                id : true, 
                userId : true,
                accountNumber : true,
                user : {
                    select : { name : true, email : true },
                }
            }
        });

        if(receiverAccount){
            targetUserId = receiverAccount.userId;
            targetAccountId = receiverAccount.id;
            targetAccountNumber = receiverAccount.accountNumber;
            targetName = receiverAccount.user.name;
            targetEmailAddress = receiverAccount.user.email;
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
            //Email to sender
            if(sender.email){
                await sendTransactionAlertEmail({
                    name : sender.name || sender.username || "Customer",
                    to : "delivered@resend.dev",
                    accountNumber : sender.account.accountNumber,
                    amount : amount,
                    reference : transactionRecord.reference
                });
            }

            //Email to receiver
            if(targetEmailAddress && targetAccountNumber){
                await sendTransactionAlertEmail({
                    name : targetName || "Customer",
                    to : "delivered@resend.dev",
                    accountNumber : targetAccountNumber,
                    amount : amount,
                    reference : transactionRecord.reference
                });
            }




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
                    vendor : vendor,
                    remarks : `${utilityType} bill payment to ${vendor}`,
                    status : "SUCCESS"
                }
            });
        });

        await sendTransactionAlertEmail({
            to : "delivered@resend.dev",
            name : initiator.name ,
            accountNumber : initiator.account.accountNumber,
            reference : transactionRecord.reference,
            amount : (transactionRecord.amount).toNumber(),
        })

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

export const getTransaction = async ( input : GetTransactionServiceInput ) =>{

    const {reference, userId} = input;
    const transactionRecord = await prisma.transaction.findFirst({
        where : { reference : reference,
            OR : [
                { senderAccount : { userId }}, //Filter through relation
                { receiverAccount : { userId }} 
                /*Find the transaction whose reference matches AND whose related sender account 
                belongs to this user OR whose related receiver account belongs to this user.*/
            ]
         },
         select : {
            id : true,
            reference : true,
            amount : true,
            remarks : true,
            utilityType : true,
            status : true,
            type : true,
            vendor : true,
            createdAt : true,

            senderAccount : {
                select : { 
                    accountNumber : true,
                    user : {
                        select  : { 
                            name :  true,
                            username : true,                                   
                        }
                    }
                }
            },

            receiverAccount : {
                select : { 
                    accountNumber : true,
                    user : {
                        select  : { 
                            name :  true,
                            username : true,                                 
                        }
                    }
                }
            }
         },

    });

    if(!transactionRecord ){
        throw new AppError("Transaction not found", 404)
    }

    const transactionType = transactionRecord.type;

    const baseData = {
        transactionId: transactionRecord.id,
        reference: transactionRecord.reference,
        type: transactionRecord.type,
        amount: transactionRecord.amount,
        status: transactionRecord.status,
        remarks: transactionRecord.remarks,
        createdAt: transactionRecord.createdAt
    };

    if(transactionType == "TRANSFER"){
        return {
            data : {
                 ...baseData,

                 sender : {
                    name : transactionRecord.senderAccount?.user.name,
                    username : transactionRecord.senderAccount?.user.username, 
                    accountNumber : transactionRecord.senderAccount?.accountNumber,
                 },
                 receiver : {
                    name : transactionRecord.receiverAccount?.user.name,
                    username : transactionRecord.receiverAccount?.user.username,
                    accountNumber : transactionRecord.receiverAccount?.accountNumber,
                 },
            },
        }
    }
    if(transactionType ==="DEPOSIT" || transactionType === "WITHDRAW"){
        return {
            data : {
               transactionId : transactionRecord?.id,
                 reference : transactionRecord.reference,
                 type : transactionRecord.type,
                 amount : transactionRecord.amount,
                 status : transactionRecord.status,
                 remarks : transactionRecord.remarks,
                 createdAt : transactionRecord.createdAt,
        },
    }
    };

    if(transactionType === "UTILITY_PAYMENT"){
        return {
            data : {
                ...baseData,
                 sender : {
                    name : transactionRecord.senderAccount?.user.name,
                    username : transactionRecord.senderAccount?.user.username, 
                    accountNumber : transactionRecord.senderAccount?.accountNumber,
                 },
                 utility : {
                    type : transactionRecord.utilityType,
                    vendor : transactionRecord.vendor,
                 },  
            },
        };
    };

    throw new AppError("Unsupported transaction type", 400);

    };


    export const transactionHistory = async( userId : string)=> {

        const daysAgo = new Date();

        daysAgo.setDate(
            daysAgo.getDate() - TRANSACTION_HISTORY_DAYS
        );

        const transactionRecord = await prisma.transaction.findMany({ //returns array 
            where : {
                createdAt : {
                    gte : daysAgo
                },
                OR : [
                    { senderAccount : { userId}},
                    { receiverAccount : {userId}},
                ]},
                orderBy : {
                    createdAt : "desc"
                },
                select : {
                    reference : true,
                    type : true,
                    amount : true,
                    createdAt : true,
                    status : true,
                    senderAccount : {
                        select : {
                            userId : true,
                            user : {
                                select : {
                                    name : true
                                }
                            }
                        }
                    },
                    receiverAccount : {
                        select : {
                            userId : true,
                            user : {
                                select : {
                                    name : true
                                }
                            }
                        }
                    },

                    vendor : true,
                    
                },
        });


        if(transactionRecord.length === 0){
            throw new AppError("No transactions found", 404);
        }

        const data = transactionRecord.map(transaction => {
            let counterparty = null;

            if(transaction.type === "UTILITY_PAYMENT"){
                counterparty = transaction.vendor;
            }


            if(transaction.type === "TRANSFER"){
                counterparty = transaction.senderAccount?.userId === userId ? 
                transaction.receiverAccount?.user.name ?? null : transaction.senderAccount?.user.name ?? null;
            }

            return {
                reference : transaction.reference,
                type : transaction.type,
                amount : transaction.amount,
                counterparty,
                status : transaction.status,
                createdAt : transaction.createdAt,
            };  
        });

            return {
                data
            };

    };


