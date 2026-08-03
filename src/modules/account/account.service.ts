//TODO (Transactions)
//wrap deposit and withdraw in prisma.transaction and create a transaction record
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/error.js";
import { DepositInput } from "./account.schema.js";

 type AccountAmountInput = DepositInput & {
    userId : string
 };

 export const deposit = async ( input : AccountAmountInput) => {
    const {amount, userId} = input;

    const account = await prisma.account.findUnique({
        where : { userId },
    });

    if(!account){
        throw new AppError("Account not found", 404);
    };

    const newBalance = account.balance.toNumber() + amount;

    if(newBalance > 100000){
        throw new AppError("Wallet balance limit exceeded",400)
    }

    const updatedAccount = await prisma.account.update({
        where : { userId },
        data : {
            balance :  {
                increment : amount,
            },
        },

        select : {
            balance : true,
        },
    });

    return {
        balance : updatedAccount.balance
    };
 };



 export const withdraw = async ( input : AccountAmountInput) => {
    const {amount, userId} = input;

    const account = await prisma.account.findUnique({
        where : { userId },
    });

    if(!account){
        throw new AppError("Account not found", 404);
    };

    const currentBalance = account.balance.toNumber();

    if(amount > currentBalance){
        throw new AppError("Insufficient balance",400)
    }

    const updatedAccount = await prisma.account.update({
        where : { userId },
        data : {
            balance :  {
                decrement : amount,
            },
        },

        select : {
            balance : true,
        },
    });

    return {
        balance : updatedAccount.balance
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