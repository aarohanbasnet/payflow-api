import jwt from "jsonwebtoken";
import { env }from "../config/env.js"


export interface JWTPayload {
    userId : string;
}

export const generateAccessToken = ( payload : JWTPayload ) : string =>{
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET_KEY, 
        {expiresIn : '15m'}
    )};

export const generateRefreshToken = ( payload : JWTPayload ) : string => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn : '30d'}
    )};

export const verifyAccessToken = (token  : string) : JWTPayload => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET_KEY) as JWTPayload
}
export const verifyRefreshToken = (token  : string) : JWTPayload => {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET_KEY) as JWTPayload
}