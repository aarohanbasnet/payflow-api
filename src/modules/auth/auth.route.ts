import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authLimiter } from "../../middlewares/ratelimitter.js";
import { registerController,
    loginController,
    logoutController,
    refreshTokenController,
    verifyOtpController, 
    resendOtpController} from "./auth.controller.js";
import { loginUserSchema, logoutSchema, registerUserSchema, verifyOtpSchema, refreshTokenSchema, resendOtpSchema} from "./auth.schema.js";

const router = Router();

router.post("/register", authLimiter, validate(registerUserSchema, "body"), registerController);
router.post("/login", authLimiter, validate(loginUserSchema, "body"), loginController);
router.post("/logout", /*validate(logoutSchema),*/ logoutController);
router.post("/verify-otp",authLimiter, validate(verifyOtpSchema, "body"), verifyOtpController);
router.post("/resend-otp", authLimiter, validate(resendOtpSchema, "body"), resendOtpController);
router.post("/refresh", authLimiter, validate(refreshTokenSchema, "body"), refreshTokenController);

export default router;