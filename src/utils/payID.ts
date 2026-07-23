import crypto from "crypto";
import { randomBytes } from "crypto";

export const generatePayId = () : string=>{
    return "PF" + randomBytes(4).toString("hex").toUpperCase;
}