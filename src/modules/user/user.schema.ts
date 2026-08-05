import {z} from "zod";

export const mpinSetupSchema = z.object({
    mpin : z.string()
    .trim()
    .regex(/^\d{4}$/, "MPIN must be exactly 4 digits"),
});

export type mpinInput = z.infer<typeof mpinSetupSchema>;