import { z } from "zod"
import { prisma }  from "../../src/config/prisma";
import { registerUserSchema } from "./auth.schema";

type RegisterInput = z.infer<typeof registerUserSchema>  //write notes here

export const register = async ( data : RegisterInput  ) =>{
    const exitingUser = await prisma.user.findUnique({
        where : {
            email : data.email,
        },
    });

    if (exitingUser) {
        throw new Error("Email already exists");
    }

    //hash password here bcrypt from util
}