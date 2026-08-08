
import {prisma} from "../../config/prisma.js"
import { AppError } from "../../utils/error.js";
import { compare } from "../../utils/hash.js";
export const verifyUserMpin = async(userId : string, mpin : string) : Promise<void> => {

        const user = await prisma.user.findUnique({
            where : { id : userId, },
            select : {
                mpin : true
            }
        });

        if(!user){
            throw new AppError("User not found", 404);
        }
        if(!user.mpin){
            throw new AppError("MPIN not set", 400);
        }

       const isValid = await compare( mpin, user.mpin ); 

       if(!isValid){
        throw new AppError("Invalid MPIN", 401);
       }
}