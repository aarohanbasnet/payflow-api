import {Request, Response, NextFunction} from "express";
import { z } from "zod";
import { AppError } from "../utils/error.js";

type ValidationTarget = "body" | "params" | "query";

export const validate = (
    schema : z.ZodSchema,
    target : ValidationTarget
 ) =>
     (req : Request, res : Response, next : NextFunction):void =>{
        const data = req[target];
        const result = schema.safeParse(data);

        if(!result.success){
            const message = result.error.issues
            .map(i => `${i.path.join('.')}: ${i.message}`)
            .join(",")
            return next(new AppError(message, 400));
        }

        req[target] = result.data;
        next();
     }
