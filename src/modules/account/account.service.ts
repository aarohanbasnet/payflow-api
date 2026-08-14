//TODO (Transactions)
//wrap deposit and withdraw in prisma.transaction and create a transaction record
//Later create a helper function since withdraw and deposit has same repeated logic
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/error.js";
import { generateReferenceNumber } from "../../utils/referenceNumber.js";
import { verifyUserMpin } from "../services/verify-mpin.service.js";
import { DepositInput, WithdrawInput } from "./account.schema.js";

 type DepositServiceInput = DepositInput & {
    userId : string
 };

 type WithdrawServiceInput = WithdrawInput & {
    userId : string;
 }

 export const deposit = async ( input : DepositServiceInput) => {
    const {amount, userId} = input;

    const account = await prisma.account.findUnique({
        where : { userId },
    });

    if(!account){
        throw new AppError("Account not found", 404);
    };

    const currentBalance = account.balance.toNumber();
    const newBalance = currentBalance + amount;

    if(newBalance > 100000){
        throw new AppError("Wallet balance limit exceeded",400)
    }

    const referenceNumber = generateReferenceNumber();

    const result = await prisma.$transaction(
        async (tx) => {
            const updatedAccount = await tx.account.update({
                where : { userId },
                data : {
                    balance : {
                        increment : amount,
                    },
                },
                select : {
                    balance : true,
                },
            });

            const  transactionRecord = await tx.transaction.create({
                data : {
                    reference : referenceNumber,
                    amount : amount,
                    type : "DEPOSIT",
                    status : "SUCCESS",
                    receiverAccountId : account.id

                }
            })

            return updatedAccount;
        }
    )
    return {
        
        balance : result.balance
    };
 };



 export const withdraw = async ( input : WithdrawServiceInput) => {
    const { userId, amount, mpin} = input;

    await verifyUserMpin(userId, mpin );
    
    const account = await prisma.account.findUnique({
        where : { userId },
    });

    if(!account){
        throw new AppError("Account not found", 404);
    };

    const currentBalance = account.balance.toNumber();

    if(amount > currentBalance ){
        throw new AppError("Insufficient balance",400)
    }

    const referenceNumber = generateReferenceNumber();

    const result = await prisma.$transaction(
        async(tx) => {
            const updatedAccount = await tx.account.update({
                where : { userId},
                data : {
                    balance : {
                        decrement : amount,
                    },
                },

                select : {
                    balance : true,
                },
            });

            const transactionRecord = await tx.transaction.create({
                data : {
                     reference : referenceNumber,
                    amount : amount,
                    type : "WITHDRAW",
                    status : "SUCCESS",
                    senderAccountId : account.id
                },
            });

            return updatedAccount;
        }
    )

    return {
        balance : result.balance
    };
 };



 export const getAccount = async ( userId : string)=> {

    const account = await prisma.account.findUnique({
        where : { userId },
        select : {
            accountNumber : true,
            balance : true,
        },
    });

    if(!account){
        throw new  AppError("Account not found", 404);
    }

    return account;

 };