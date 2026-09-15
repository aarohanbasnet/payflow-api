import { getTransaction, transferAmount, utilityPayment } from "./transaction.service.js";
import { AppError } from "../../utils/error.js";
import { transactionHistory } from "./transaction.service.js";
export const transferAmountController = async (req, res) => {
    const input = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const result = await transferAmount({ userId, ...input });
    res.status(201).json({
        success: true,
        message: "Fund transfer successful",
        data: result.data,
    });
};
export const utilityPaymentController = async (req, res) => {
    const input = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const result = await utilityPayment({ userId, ...input });
    res.status(201).json({
        success: true,
        message: "Payment successful",
        data: result.data,
    });
};
export const getTransactionController = async (req, res) => {
    const input = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const result = await getTransaction({ userId, ...input });
    res.status(200).json({
        success: true,
        message: "Transaction retrived successfully",
        data: result.data,
    });
};
export const transactionHistoryController = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const result = await transactionHistory(userId);
    res.status(200).json({
        success: true,
        message: "Transaction history fetched successfully",
        data: result.data,
    });
};
//# sourceMappingURL=transaction.controller.js.map