import { getUserProfile, setUserMpin } from "./user.service.js";
import { AppError } from "../../utils/error.js";
export const userProfileController = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const profile = await getUserProfile(userId);
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: profile
    });
};
export const setUserMpinController = async (req, res) => {
    const input = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    ;
    await setUserMpin({ userId, ...input });
    res.status(200).json({
        success: true,
        message: "MPIN set successfully",
    });
};
//# sourceMappingURL=user.controller.js.map