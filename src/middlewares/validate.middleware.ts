import {Request, Response, NextFunction} from "express";
import { ZodAny } from "zod";
import { AppError } from "../utils/error.js";

export const validate = (schema : ZodAny)=>
     (req : Request, res : Response, next : NextFunction):void =>{
        const result = schema.safeParse(req.body);

        if(!result.success){
            const message = result.error.issues
            .map(i => `${i.path.join('.')}: ${i.message}`)
            .join(",")
            return next(new AppError(message, 400));
        }

        req.body = result.data;
        next();
     }
