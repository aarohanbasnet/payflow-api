import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";

export function errorHandler( err : unknown, req : Request, res : Response, next : NextFunction) : void{
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Internal server error';

    console.error(err);

    res.status(statusCode).json({
        success : false,
        message,
    })
}