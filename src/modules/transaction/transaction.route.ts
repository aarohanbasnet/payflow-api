import { Router } from "express";
import { isLoggedin } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getTransactionSchema, transferInputSchema, utilityInputSchema } from "./transaction.schema.js";
import { getTransactionController, transactionHistoryController, transferAmountController, utilityPaymentController } from "./transaction.controller.js";
const router = Router();

router.post("/transfer", isLoggedin, validate(transferInputSchema, "body"), transferAmountController);
router.post("/utility-payment", isLoggedin, validate(utilityInputSchema, "body"), utilityPaymentController);
router.get("/history", isLoggedin, transactionHistoryController);
router.get("/:reference", isLoggedin, validate(getTransactionSchema, "params"), getTransactionController);

export default router;