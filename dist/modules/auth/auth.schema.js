import { z } from "zod";
export const registerUserSchema = z.object({
    name: z.string().min(4, "name must be at least 4 characters")
        .max(50, "Name cannot exceed 50 characters"),
    email: z.email("Invalid email address")
        .trim()
        .toLowerCase(),
    phone: z.string().trim().regex(/^\d{10}$/, "Phone number must contain exactly 10 digits"),
    password: z.string().min(8, "Password must be atleast 8 characters")
});
export const loginUserSchema = z.object({
    identifier: z.string().trim().min(1, "Phone number or username is required"),
    password: z.string().min(1, "password is required")
        .optional(),
    mpin: z.string().length(4, "MPIN must be exactly 4 digits")
        .optional()
})
    .refine((data) => (data.password && !data.mpin) || //XOR operation either password or mpin
    (!data.password && data.mpin), {
    message: "Provide either password or MPIN",
    path: ["password"], //which filed should receive error
});
export const resendOtpSchema = z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
});
export const verifyOtpSchema = z.object({
    userId: z.string().min(1, "userId is requied"),
    code: z.string().length(6, "OTP must be 6 digits")
});
export const refreshTokenSchema = z.object({
    token: z.string().min(1, "Refresh token is required")
});
export const logoutSchema = z.object({
    token: z.string().min(1, "Refresh token is required")
});
//# sourceMappingURL=auth.schema.js.map