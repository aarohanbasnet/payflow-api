import { Response } from "express";
import { loginUser, logoutUser, refreshToken, registerUser } from "./auth.services.js";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/error.js";
import { env } from "../../config/env.js";

export const registerController =  async (
    req : customRequest,
    res : Response
) => {
    const { id ,name, email ,username ,accountNumber } = await registerUser(req.body);
    res.status(201).json({
        success : true,
        message: "Account created successfully",
        data : {
            id,
            name,
            email,
            username,
            accountNumber
        },
    });
};


export const loginController = async (
    req : customRequest,
    res : Response
) => {
    const {accessToken , refreshToken} = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        sameSite : "strict",
        maxAge : env.REFRESH_TOKEN_TTL_MS,
    });

    res.status(200).json({
        success : true,
        message : "Login successful",
        data : {
            accessToken,
        },
    });
}

export const logoutController = async (
    req : customRequest, 
    res : Response
) => {
    const token = req.cookies.refreshToken;
   if(!token){
    throw new AppError("Refresh token missing", 401)
   }
   const result = await logoutUser(token);
   res.clearCookie("refreshToken");


    res.status(200).json({
        success : true, 
        message : "Logged out successfully",
        data : result,
    });
};


export const refreshTokenController = async (
    req : customRequest,
    res : Response
) => {
    const token = req.cookies.refreshToken;
    if(!token) {
        throw new AppError("Refresh token missing", 401);
    }

    const tokens = await refreshToken(token); //const {accessTokeen, refreshToken} = refreshToken(token);
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly : true,
        sameSite : "strict",
        maxAge : env.REFRESH_TOKEN_TTL_MS,
    });

    res.status(200).json({
        success : true,
        message : "Token refreshed successfully",
        data: {
            accessToken : tokens.accessToken,
        },
    });
};