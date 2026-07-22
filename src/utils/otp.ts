import crypto from "crypto";

export const generateOTP = ():string =>{
    return crypto.randomInt(100000, 100000).toString();
}

export const getOTPExpiry = (minutes = 10) : Date =>{
    return new Date(Date.now()+ minutes *60*1000);
};

export const isOTPExpired = (expiresAt : Date) : boolean =>{
    return expiresAt.getTime() < Date.now();
}