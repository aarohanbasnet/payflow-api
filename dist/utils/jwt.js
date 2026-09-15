import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./error.js";
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '30d' });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, env.ACCESS_TOKEN_SECRET_KEY);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Access token expired", 401);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid access token", 401);
        }
        throw error;
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET_KEY);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Access token expired", 401);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid access token", 401);
        }
        throw error;
    }
};
//# sourceMappingURL=jwt.js.map