import { z } from "zod"
import { prisma }  from "../../config/prisma.js";
import { registerUserSchema } from "./auth.schema.js";

type RegisterInput = z.infer<typeof registerUserSchema>  //write notes here

export const register = async ( data : RegisterInput  ) =>{
    const exitingUser = await prisma.user.findUnique({
        where : {
            email : data.email,
        },
    });

    if (exitingUser) {
        throw new Error("User with this email already exists");
    }

    //hash password here bcrypt from util
}