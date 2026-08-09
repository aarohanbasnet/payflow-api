import { Response } from "express";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { TransferInput } from "./transaction.schema.js";
import { transferAmount } from "./transaction.service.js";
import { AppError } from "../../utils/error.js";

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