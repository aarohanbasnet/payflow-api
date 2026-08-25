import { prisma } from "../../config/prisma.js";
import { TransactionStatus, TransactionType } from "../../generated/prisma/enums.js";
import { AppError } from "../../utils/error.js";

interface IGetInvoiceDataInput {
    reference : string,
    userId : string,
};

interface InvoiceData {
    invoice : {
        reference : string,
        issuedAt : Date,
        status : string,
    };

    customer : {
        name : string,
        accountNumber : string,
    };

    payment : {
        utilityType : string,
        vendor : string,
        amount : number,
        remarks : string,
        paidAt : Date,
    };
};

export const getInvoceData = async ( input : IGetInvoiceDataInput ) : Promise <InvoiceData> => {
    const { userId , reference } = input;

    const user = await prisma.user.findUnique({
        
        where : { id : userId },
        select : {
            name : true,

            account : {
                select : {
                    accountNumber : true,
                    sentTransactions : {
                        where : { reference,},
                        select : {
                            reference : true,
                            amount : true,
                            type : true,
                            status : true,
                            utilityType : true,
                            vendor : true,
                            remarks : true,
                            createdAt : true,
                         },
                    },
                },
            
            },

        },
    });

    if(!user){
        throw new AppError("User not found", 404);
    }

    if(!user.account){
        throw new AppError("Account not found", 404);
    }

    const transaction = user.account.sentTransactions[0];

    if(!transaction){
        throw new AppError("Transaction not found", 404)
    }

    if( transaction.type !== TransactionType.UTILITY_PAYMENT){
        throw new AppError("Invoice is only available for utility payments", 400);
    }

    if(transaction.status !== TransactionStatus.SUCCESS){
        throw new AppError("Invoice is only aviilable for successful payments", 400)
    }

    if(!transaction.utilityType){
        throw new AppError("Utility type is missing from transaction", 500)
    }

    if(!transaction.vendor){
        throw new AppError("Utility vendor is missing from transaction", 500);
    }

    const remarks = transaction.remarks ?? `${transaction.utilityType} bill payment`;

    return {
        invoice : {
            reference : transaction.reference,
            issuedAt : transaction.createdAt,
            status : transaction.status,
        },
        customer : {
            name : user.name,
            accountNumber : user.account.accountNumber,
        },
        payment : {
            utilityType : transaction.utilityType,
            vendor : transaction.vendor,
            amount : (transaction.amount).toNumber(),
            remarks,
            paidAt : transaction.createdAt,
        },
    };
};
