import { customRequest } from "../../middlewares/auth.middleware.js";
import {application, Response} from "express";
import { AppError } from "../../utils/error.js";
import { getInvoceData } from "./invoice.service.js";
import { generateInvoicePDF } from "./pdf/invoice.pdf.js";


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

    const invoiceData = await getInvoceData({ reference, userId});
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Dispostion",
        `attachment; filename='invoice-${reference}.pdf`
    );

    res.status(200).send(pdfBuffer);
}