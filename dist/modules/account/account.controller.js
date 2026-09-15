import { AppError } from "../../utils/error.js";
import { deposit, withdraw, getAccount } from "./account.service.js";
export const depositController = async (req, res) => {
    const userId = req.user?.userId;
    const { amount } = req.body;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const result = await deposit({ userId, amount });
    res.status(200).json({
        success: true,
        message: `NPR ${amount} deposited successfully`,
        data: result
    });
};
export const withdrawController = async (req, res) => {
    const userId = req.user?.userId;
    const { amount, mpin } = req.body;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const result = await withdraw({ userId, amount, mpin });
    res.status(200).json({
        success: true,
        message: `NPR ${amount} withdrawn successfully`,
        data: result
    });
};
export const getAccountController = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const account = await getAccount(userId);
    res.status(200).json({
        success: true,
        message: "Account fetched successfully",
        data: account
    });
};
//# sourceMappingURL=account.controller.js.map