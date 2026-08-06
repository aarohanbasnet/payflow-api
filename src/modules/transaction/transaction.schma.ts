import {z} from "zod";

export const transferInputSchema = z.object({
    identifierType : z.enum([
        "USERNAME",
        "PHONE",
        "ACCOUNT_NUMBER",
    ]),
    identifier : z
                .string()
                .trim()
                .min(1, "Identifer is required"),
    
    amount : z  
            .number()
            .min(100, "Minimum transfer amount is NPR 100")
            .max(25000, "Maximum transfer amount is NPR 25000"),
                
    mpin : z
            .string()
            .regex(/^\d{4}$/, "MPIN must be exactly 4 digits"),

    remarks : z
            .string()
            .trim()
            .max(100, "Remarks cannot exceed 100 characters")
            .optional()
});

export type TransferInput = z.infer<typeof transferInputSchema>