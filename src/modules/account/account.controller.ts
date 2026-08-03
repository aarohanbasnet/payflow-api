import { Response } from "express";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/error.js";
import { deposit, withdraw, getAccount } from "./account.service.js";
import { DepositInput, WithdrawInput } from "./account.schema.js";

export const depositController = async( 
    req : customRequest, 
    res : Response
) => {
 const userId = req.user?.userId;
 const { amount } = req.body as DepositInput;

 if(! userId){
    throw new AppError("Unauthorized", 401)
 }

 const result = await deposit({userId, amount});

 res.status(200).json({
    success : true,
    message : `NPR ${amount} deposited successfully`,
    data : result
 });

};


export const withdrawController = async( 
    req : customRequest, 
    res : Response
) => {
 const userId = req.user?.userId;
 const { amount } = req.body as WithdrawInput;

 if(! userId){
    throw new AppError("Unauthorized", 401)
 }

 const result = await withdraw({userId, amount});

 res.status(200).json({
    success : true,
    message : `NPR ${amount} withdrawn successfully`,
    data : result
 });

};

export const getAccountController = async (
    req : customRequest,
    res : Response
)  =>{

    const userId = req.user?.userId;

    if(!userId){
        throw new AppError("Unauthorized",401);
    }

    const account = await getAccount(userId);

    res.status(200).json({
        success : true,
        message : "Account fetched successfully",
        data : account
    });
};

