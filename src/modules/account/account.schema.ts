import z from "zod";

export const depositInputSchema = z.object({
 amount : z.number()
        .positive("Amount must be greater than 0")
        .max(100000,"Maximum deposit amount is NPR 1,00,000")
});

export type DepositInput = z.infer<typeof depositInputSchema>

export const withdrawInputSchema = z.object({
    amount : z.number()
    .min(100, "Minimum withdrawl amount is NPR 100")
    .max(1000, "Maximum withdrawl amount is NPR 1,00,000"),
});

export type WithdrawInput =z.infer<typeof withdrawInputSchema>