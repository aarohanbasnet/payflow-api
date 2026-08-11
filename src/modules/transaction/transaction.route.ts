import { Router } from "express";
import { isLoggedin } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { transferInputSchema, utilityInputSchema } from "./transaction.schema.js";
import { transferAmountController, utilityPaymentController } from "./transaction.controller.js";
const router = Router();

router.post("/transfer", isLoggedin, validate(transferInputSchema), transferAmountController);
router.post("/utility-payment", isLoggedin, validate(utilityInputSchema), utilityPaymentController);

export default router;