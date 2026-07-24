import { prisma } from "../config/prisma.js";
 export const  generateUsername = async (email:string) : Promise<string> => {

    const sanitized = email
    .split("@")[0]!
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "");

    const baseUsername = sanitized || "user";

    let username = `${baseUsername}@payflow`;
    let counter = 1;

    while(true) {
        const existingUsername = await prisma.user.findUnique({
        where : {username}
    });

    if(!existingUsername){
        return username;
    }

    username = `${baseUsername}${counter}@payflow`
    counter ++;


    }
 }
    
 
  