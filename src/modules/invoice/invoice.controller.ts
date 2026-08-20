import { customRequest } from "../../middlewares/auth.middleware.js";
import {Response} from "express";
import { AppError } from "../../utils/error.js";
import { getInvoceData } from "./invoice.service.js";


export const generateInvoiceController = async (
    req : customRequest,
    res : Response,
)=> {
    const { reference } = req.params;
    if( typeof reference !== "string"){
        throw new AppError("Invalid reference", 400);
    }
    const userId = req.user?.userId;


    if(!userId){
        throw new AppError("Unauthorized", 401);
    }
    if(!reference){
        throw new AppError("Transaction reference is required", 200);
    }

    const result = await getInvoceData({ reference, userId});

    res.status(200).json({
        success : true,
        message : "Invoice generated successfully",
        data : result
    })
}