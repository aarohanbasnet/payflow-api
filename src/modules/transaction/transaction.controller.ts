import { Response } from "express";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { GetTransactionInput, TransferInput, UtilityInput } from "./transaction.schema.js";
import { getTransaction, transferAmount, utilityPayment } from "./transaction.service.js";
import { AppError } from "../../utils/error.js";
import { success } from "zod";

export const transferAmountController = async(
    req : customRequest,
    res : Response ) => {
        const input = req.body as TransferInput;
        const userId = req.user?.userId;

        if(!userId) {
            throw new AppError("Unauthorized", 401);
        }

        const result = await transferAmount( {userId, ...input});
        res.status(201).json({
            success : true,
            message : "Fund transfer successful",
            data  : result.data,
        });

    };

export const utilityPaymentController = async(
    req : customRequest,
    res : Response )  => {
        const input = req.body as UtilityInput;
        const userId = req.user?.userId;

        if(!userId){
            throw new AppError("Unauthorized", 401);
        }

        const result = await utilityPayment( {userId, ...input});
        res.status(201).json({
            success : true,
            message : "Payment successful",
            data : result.data,
        });
    };

    export const getTransactionController = async(
        req : customRequest,
        res : Response ) => {
            const input = req.params as GetTransactionInput;
            const userId = req.user?.userId

            if(!userId){
                throw new AppError("Unauthorized", 401);
            }

            const result = await getTransaction({userId, ...input});
            res.status(200).json({
                success : true,
                message : "Transaction retrived successfully",
                data : result.data,
        });

        }