import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { isLoggedin } from "../../middlewares/auth.middleware.js";
import { setUserMpinController, userProfileController } from "./user.controller.js";
import { mpinSetupSchema } from "./user.schema.js";
const router = Router();

router.post("/me", isLoggedin, userProfileController);
router.post("/me/mpin", isLoggedin, validate(mpinSetupSchema), setUserMpinController);

export default router;