import { z } from "zod"
import { prisma }  from "../../config/prisma.js";
import { registerUserSchema } from "./auth.schema.js";
import { AppError } from "../../utils/error.js";
import { hash } from "../../utils/hash.js";
import { generateAccountNumber } from "../../utils/accountNumber.js";
import { generateUsername } from "../../utils/username.js";
import { generateOTP, getOTPExpiry, isOTPExpired } from "../../utils/otp.js";
import { compare } from "../../utils/hash.js";


type RegisterInput = z.infer<typeof registerUserSchema>  // z.infer = If this schema validates successfully, what will the resulting TypeScript type be?

export const registerUser = async function ( input:RegisterInput) {
    const existingUser = await prisma.user.findFirst({
        where : {
            OR : [
                {email : input.email},
                {phone : input.phone},
            ],
        }
    });

    if(existingUser) {
        throw new AppError("User already exists with this email or phone", 409)
    }

    const generatedUsername = await generateUsername(input.email);
    const hashedPassword = await hash(input.password);

    const user = await prisma.user.create({
        data : {
            name : input.name,
            email : input.email,
            phone: input.phone,
            username : generatedUsername, 
            password : hashedPassword,
            account : {
                create : {
                    accountNumber : generateAccountNumber(),
                },
            },
        },
        include : {account : true},
    });

    const otpCode = generateOTP();
    const hashedOTP = await hash(otpCode)
    await prisma.oTP.create({
        data : {
            code : hashedOTP,
            expiresAt : getOTPExpiry(),
            userId : user.id,
        },
    });

    return {
        id : user.id,
        name : user.name,
        email : user.email,
        username : user.username,
        accountNumber : user.account?.accountNumber,
    }
};


export const verifyOtp = async (userId : string, code : string) => {
    const otp = await prisma.oTP.findFirst({
        where : {userId, isUsed : false},
        orderBy : {createdAt : "desc"}
    });

    if(!otp) throw new AppError("No pending OTP found, request a new one", 404);
    if(isOTPExpired(otp.expiresAt)) throw new AppError("OTP has expired", 410);
    // if(otp.code !== code) throw new AppError("Invalid OTP", 400);

    const isValid = await compare(code, otp.code);
    if(!isValid){
        throw new AppError("Invalid OTP", 400)
    }

    await prisma.$transaction([
        prisma.oTP.update({ where : {id : otp.id}, data : {isUsed : true}}),
        prisma.user.update({where : {id : userId}, data : {isVerified : true}})
    ]);

    return {verified : true};
}