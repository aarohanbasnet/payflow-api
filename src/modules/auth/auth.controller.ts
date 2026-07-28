import { Response } from "express";
import { loginUser, logoutUser, refreshToken, registerUser, verifyOtp } from "./auth.services.js";
import { customRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/error.js";
import { env } from "../../config/env.js";
import { RefreshTokenInput, RegisterInput, LoginInput, LogoutInput, VerifyOtpInput } from "./auth.schema.js";

export const registerController =  async (
    req : customRequest,
    res : Response
) => {
    const input = req.body as RegisterInput;
    const { id ,name, email ,username ,accountNumber } = await registerUser(input);
    
    return res.status(201).json({
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
    const input = req.body as LoginInput;
    const {accessToken , refreshToken} = await loginUser(input);
     res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        sameSite : "strict",
        maxAge : env.REFRESH_TOKEN_TTL_MS,
    });

    return res.status(200).json({
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


    return res.status(200).json({
        success : true, 
        message : "Logged out successfully",
        data : result,
    });
};


export const refreshTokenController = async (
    req : customRequest,
    res : Response
) => {
    const token  = req.cookies.refreshToken;
    if(!token) {
        throw new AppError("Refresh token missing", 401);
    }

    const tokens = await refreshToken(token); //const {accessTokeen, refreshToken} = refreshToken(token);
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly : true,
        sameSite : "strict",
        maxAge : env.REFRESH_TOKEN_TTL_MS,
    });

    return res.status(200).json({
        success : true,
        message : "Token refreshed successfully",
        data: {
            accessToken : tokens.accessToken,
        },
    });
};

export const verifyOtpController = async (
    req : customRequest,
    res : Response,
)=> {
const input = req.body as VerifyOtpInput;
 const {userId , code } = input;

 if(!userId  || !code) {
    throw new AppError("Both userId and code are required", 400)
 };

 const result = await verifyOtp(input);
 
 return res.status(200).json({
    success : true,
    message : "OTP verified successfully",
    data : {
        result : result
    },
 });
};