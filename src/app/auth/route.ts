
import { Router } from "express";
import { container } from "tsyringe";

import { TOKENS } from "../../lib/di/tokens";
import { AuthController } from "./controller/auth.controller";

export const authRouter = Router();

const authController = container.resolve<AuthController>(
    TOKENS.AuthController
);

authRouter.post("/register", authController.register);
authRouter.post("/verify-account", authController.verifyAccount);

authRouter.post("/send-otp", authController.sendOtp);
authRouter.post("/reset-password", authController.resetPassword);

authRouter.post("/login", authController.login);
authRouter.post("/enable-2-step", authController.enableTwoStep);
authRouter.post("/verify-2-step", authController.verifyTwoStep);
authRouter.post("/activate-2-step", authController.activateTwoStep);
authRouter.post("/google", authController.googleLogin);

authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);
