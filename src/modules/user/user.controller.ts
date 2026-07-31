import { Request, Response } from "express";
import { getUserProfile } from "./user.service.js";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/error.js";

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