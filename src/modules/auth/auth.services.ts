import { z } from "zod"
import { env }from "../../config/env.js"
import { prisma }  from "../../config/prisma.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { AppError } from "../../utils/error.js";
import { hash, compare} from "../../utils/hash.js";
import { generateAccountNumber } from "../../utils/accountNumber.js";
import { generateUsername } from "../../utils/username.js";
import { generateOTP, getOTPExpiry, isOTPExpired } from "../../utils/otp.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";


type RegisterInput = z.infer<typeof registerUserSchema>
type LoginInput = z.infer<typeof loginUserSchema>  // z.infer = If this schema validates successfully, what will the resulting TypeScript type be?

export const registerUser = async  ( input:RegisterInput) =>{
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


export const verifyOtp = async (userId : string, code : string) =>{
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



export const loginUser = async (input : LoginInput)  => {
    const user = await prisma.user.findFirst({
        where : {
            OR : [
                {email : input.identifier},
                {username : input.identifier},
                {phone : input.identifier},
            ],
        },
    });

    if(!user) throw new AppError("Invalid Credentials", 401);

    //Login with password
    if(input.password) {
        const isPasswordValid = await compare(input.password, user.password);

        if(!isPasswordValid) {
            throw new AppError("Invalid credentials", 401);
        }
    }
    //Login with MPIN
    else if (input.mpin) {

        if(!user.mpin) {
            throw new AppError("Invalid credentials", 401);
        }

        const isMpinValid = await compare(input.mpin, user.mpin);

        if(!isMpinValid) {
            throw new AppError("Invalid credentials", 401);
        }
    };

    if(!user.isVerified) throw new AppError("Account not verified", 403);

    const accessToken = generateAccessToken({ userId : user.id});
    const refreshToken = generateRefreshToken({ userId : user.id});
    const hashedRefreshToken = await hash(refreshToken);

    const REFRESH_TOKEN_TTL_MS = env.REFRESH_TOKEN_TTL_MS;

    await prisma.refreshToken.create({
        data : {
            token :  hashedRefreshToken,
            userId : user.id,
            expiresAt : new Date(Date.now() + REFRESH_TOKEN_TTL_MS )
        },
    });

    return {accessToken, refreshToken}
}

//rotate refresh token
export const refreshToken = async ( token : string) => {

    const payload = verifyRefreshToken(token);
    const stored = await prisma.refreshToken.findUnique({
        where : { userId : payload.userId }
    });

    if(!stored){
        throw new AppError("Refresh token expired, please login again", 401);
    } 

    if(stored.expiresAt.getTime()< Date.now()){
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const isValid = await compare(token, stored.token);

    if(!isValid) {
        throw new AppError("Invalid or expired refresh token", 401);
    }
    
    const newAccessToken = generateAccessToken({ userId : payload.userId });
    const newRefreshToken = generateRefreshToken({userId : payload.userId});

    const hashedRefreshToken = await hash (newRefreshToken);

    await prisma.refreshToken.update({
        where : {
            userId : payload.userId,
        },
        data : {
            token : hashedRefreshToken,
            expiresAt : new Date(Date.now() + env.REFRESH_TOKEN_TTL_MS),
        },
    });

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
    };
}


export const logoutUser = async (token : string)=> {
    await prisma.refreshToken.deleteMany({where : {token} });
    return {loggedOut : true};
}