import { z } from "zod";

export const invoiceParamsSchema = z.object({
    reference : z.string().trim().min(1, "Transaction refrence is required"),
});