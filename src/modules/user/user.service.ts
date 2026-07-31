import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/error.js";
import { hash } from "../../utils/hash.js";

interface SetupMpinInput {
    userId : string;
    mpin : string;
}

export const getUserProfile = async (userId : string)=> {
    const user = await prisma.user.findUnique({
        where: { id : userId},
        select : {
            id : true,
            name : true,
            username : true,
            email : true,
            phone : true,
            account : {
                select : {
                    balance : true,
                    accountNumber : true,
                },
            },
        },
    });

    if(!user){
        throw new AppError("User not found", 404);
    } 

    return user;
};


export const setUserMpin = async ( input : SetupMpinInput)  => {
    const {userId, mpin } = input;
    const user = await prisma.user.findUnique({
        where : {
            id : userId,
        },
    });

    if(!user){
        throw new AppError("User not found", 404);
    }

    if(user.mpin){
        throw new AppError("MPIN is already set", 400);
    }

    const hashedMpin = await  hash(mpin);

    await prisma.user.update({
        where : { id : userId },
        data : { mpin : hashedMpin },
    });
};