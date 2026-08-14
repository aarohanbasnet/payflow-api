import { Router } from "express";
import { depositController, withdrawController, getAccountController } from "./account.controller.js";
import { isLoggedin } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { depositInputSchema, withdrawInputSchema } from "./account.schema.js";

const router = Router();

router.post("/deposit", isLoggedin, validate(depositInputSchema, "body"), depositController);
router.post("/withdraw", isLoggedin, validate(withdrawInputSchema, "body"), withdrawController);
router.get("/", isLoggedin,  getAccountController);

export default router;