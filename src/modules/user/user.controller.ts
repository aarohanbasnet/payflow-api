import { Request, Response } from "express";
import { getUserProfile, setUserMpin } from "./user.service.js";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/error.js";
import { mpinInput } from "./user.schema.js";

export const userProfileController = async (
    req : customRequest,
    res : Response
) : Promise <void> =>{
    const userId = req.user?.userId;

    if(!userId){
        throw new AppError("Unauthorized",401);
    }

    const profile = await getUserProfile(userId);
    res.status(200).json({
        success : true,
        message : "Profile fetched successfully",
        data : profile
    });
}

export const setUserMpinController = async (
    req : customRequest,
    res : Response
) : Promise<void> => {

    const input = req.body as mpinInput;
    const userId = req.user?.userId;

    if(!userId){
        throw new AppError("Unauthorized", 401);
    };

    await setUserMpin({userId, ...input });
    res.status(200).json({
        success : true,
        message : "MPIN set successfully",
    });
};