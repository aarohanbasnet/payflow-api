import z from "zod";

const mpinSchema = z
        .string()
        .regex(/^\d{4}$/, "MPIN must be exactly 4 digits");

export const depositInputSchema = z.object({
 amount : z.number()
        .positive("Amount must be greater than 0")
        .max(100_000,"Maximum deposit amount is NPR 1,00,000"),
});

export type DepositInput = z.infer<typeof depositInputSchema>

export const withdrawInputSchema = z.object({
    amount : z.number()
    .min(100, "Minimum withdrawal amount is NPR 100")
    .max(100_000, "Maximum withdrawal amount is NPR 1,00,000"),

    mpin : mpinSchema,
});

export type WithdrawInput =z.infer<typeof withdrawInputSchema>