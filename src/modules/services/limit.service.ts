import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/error.js";

const DEFAULT_DAILY_LIMIT_NPR = 100000;

export const checkDailyTransactionLimit = async(
    senderAccountId : string,
    amount : number,
    maxLimit : number = DEFAULT_DAILY_LIMIT_NPR
) : Promise <void> => {

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const aggregate = await prisma.transaction.aggregate({
        _sum : {
            amount : true,
        },
        where : {
            senderAccountId : senderAccountId,
            status : "SUCCESS",
            createdAt : {
                gte : startOfDay
            },
        },
    });

    const totalTransferredToday = aggregate._sum.amount?.toNumber() ?? 0; 

    if(totalTransferredToday + amount > maxLimit) {
        const remainingLimit = Math.max(0, maxLimit - totalTransferredToday);
        throw new AppError(`Daily transaction limit of Rs. ${maxLimit.toLocaleString()}.exceeded. Remaining limit for today : Rs. ${remainingLimit.toLocaleString}`, 400);
    }
}