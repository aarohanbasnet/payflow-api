import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { isLoggedin } from "../../middlewares/auth.middleware.js";
import { userProfileController } from "./user.controller.js";
const router = Router();

router.post("/me", isLoggedin, userProfileController);

export default router;