import crypto from "crypto";
export const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};
export const getOTPExpiry = (minutes = 10) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};
export const isOTPExpired = (expiresAt) => {
    return expiresAt.getTime() < Date.now();
};
//# sourceMappingURL=otp.js.map