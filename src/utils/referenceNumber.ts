import { randomBytes } from "crypto";

export const generateReferenceNumber = () : string => {
    const reference = randomBytes(6)
    .toString("hex")
    .toUpperCase();

    return `TX-${reference.slice(0,4)}-${reference.slice(4,8)}-${reference.slice(8,12)}`;
}