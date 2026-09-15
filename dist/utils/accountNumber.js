import { randomBytes } from "crypto";
export const generateAccountNumber = () => {
    return "PF" + randomBytes(4).toString("hex").toUpperCase();
};
//# sourceMappingURL=accountNumber.js.map