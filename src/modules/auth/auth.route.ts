import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerController,
    loginController,
    logoutController,
    refreshTokenController,
    verifyOtpController } from "./auth.controller.js";
import { loginUserSchema, logoutSchema, registerUserSchema, verifyOtpSchema, refreshTokenSchema} from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerUserSchema, "body"), registerController);
router.post("/login", validate(loginUserSchema, "body"), loginController);
router.post("/logout", /*validate(logoutSchema),*/ logoutController);
router.post("/verify-otp",validate(verifyOtpSchema, "body"), verifyOtpController);
router.post("/refresh", validate(refreshTokenSchema, "body"), refreshTokenController);

export default router;