import { Router } from "express";
import { isLoggedin } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { transferInputSchema } from "./transaction.schema.js";
import { transferAmountController } from "./transaction.controller.js";
const router = Router();

router.post("/transfer", isLoggedin, validate(transferInputSchema), transferAmountController);

export default router;