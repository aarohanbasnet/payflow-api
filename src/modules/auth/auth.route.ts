import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerController,
    loginController,
    logoutController,
    refreshTokenController,
    verifyOtpController } from "./auth.controller.js";
import { loginUserSchema, logoutSchema, registerUserSchema, verifyOtpSchema, refreshTokenSchema} from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerUserSchema), registerController);
router.post("/login", validate(loginUserSchema), loginController);
router.post("/logout", validate(logoutSchema), logoutController);
router.post("/verify-otp",validate(verifyOtpSchema), verifyOtpController);
router.post("/refresh", validate(refreshTokenSchema), refreshTokenController);

export default router;