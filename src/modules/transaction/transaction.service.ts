import{ prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/error.js";
import { verifyUserMpin } from "../services/verify-mpin.serivce.js";
import { TransferInput } from "./transaction.schema.js";

type TransferServiceInput = TransferInput & {
    userId : string
}

export const transferAmount = async( input : TransferServiceInput)=> {

    const {identifierType, identifier, amount, remarks, mpin, userId} = input;

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

    let targetUserId : string | null = null;
    let targetAccountId : string | null = null;

    if(identifierType === "USERNAME"){

        const receiver = await prisma.user.findUnique({
            where : { username :  identifier},
            select :{ 
                id : true, 
                account : {
                    select : {
                        id : true
                    },
                },
            },
        });

        if(receiver){
            targetUserId = receiver.id;
            targetAccountId = receiver.account?.id || null;
        }
    } else if (identifierType === "PHONE"){
        const receiver = await prisma.user.findUnique({
            where : { phone : identifier},
            select : {
                id : true,
                account : {
                    select : {
                        id : true
                    },
                },
            },
        });

        if(receiver){
            targetUserId = receiver.id;
            targetAccountId = receiver.account?.id || null;
        }
    } else if (identifierType === "ACCOUNT_NUMBER"){
        const receiverAccount = await prisma.account.findUnique({
            where : { accountNumber : identifier},
            select : {
                id : true, 
                userId : true
            }
        });

        if(receiverAccount){
            targetUserId = receiverAccount.userId;
            targetAccountId = receiverAccount.id;
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
    

}
