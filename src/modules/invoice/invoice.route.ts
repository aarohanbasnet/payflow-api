import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { generateInvoiceController } from "../invoice/invoice.controller.js";
import { invoiceParamsSchema } from "./invoice.schema.js";
import { isLoggedin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/invoice/:reference", validate(invoiceParamsSchema, "params"), isLoggedin, generateInvoiceController);

export default router;