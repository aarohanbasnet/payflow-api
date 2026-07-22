import {Request, Response, NextFunction} from "express";
import { AppError } from "../utils/error.js";
import { JWTPayload, verifyAccessToken } from "../utils/jwt.utils.js";

interface customRequest extends Request{
    user : JWTPayload;
}

export const isLoggedin = (req : customRequest, res: Response, next : NextFunction)=>{

   let  token : string | undefined
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

    } else if (req.cookies.accessToken){
        token = req.cookies.accessToken;
    }

    if(!token){
        throw new AppError("Please login or register", 401);
    };

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
}