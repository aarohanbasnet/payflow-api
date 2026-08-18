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
                .min(1, "Identifier is required"),
    
    amount : z  
            .number()
            .min(100, "Minimum transfer amount is NPR 100")
            .max(25000, "Maximum transfer amount is NPR 25,000"),
                
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

export const utilityInputSchema =z.object({
        utilityType : z.enum([
                "ELECTRICITY",
                "MOBILE_TOPUP",
                "WATER",
                "INTERNET",
                "TV"]),

        vendor : z.enum([
                "NEA",
                "WORLDLINK",
                "VIANET",
                "SUBISU",
                "NTC",
                "NCELL",
                "DISHHOME",
                "KUKL"]),
        
         amount : z  
            .number()
            .min(100, "Minimum payment amount is NPR 100")
            .max(25000, "Maximum payment amount is NPR 25,000"),
                
        mpin : z
            .string()
            .regex(/^\d{4}$/, "MPIN must be exactly 4 digits"),

});

export type UtilityInput = z.infer< typeof utilityInputSchema>

export const getTransactionSchema = z.object({
        reference : z
                .string()
                .trim()
                .min(1, "Transaction reference is required"),
});

export type GetTransactionInput = z.infer< typeof getTransactionSchema>

