
import type { NextFunction, Request, Response } from "express";

import authService, { AuthService } from "../service/auth.service";
import { setCookies } from "../utils";

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = authService;
    }

    // Register
    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = await this.authService.register(req.body);

            return res.status(201).json({
                message: "User created successfully",
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    // Verify Account
    verifyAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = await this.authService.verifyAccount(req.body);

            return res.status(200).json({
                message: "Account verified successfully",
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    // Send OTP
    sendOtp = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.authService.sendOtp(req.body);

            return res.status(200).json({
                message: "OTP sent successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Login
    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const tokens = await this.authService.login(req.body);

            if (!tokens?.accessToken || !tokens?.refreshToken) {
                return res.status(200).json({
                    message: "OTP sent for 2-step verification",
                    success: true
                });
            }

            setCookies(res, tokens.accessToken, tokens.refreshToken);

            return res.status(200).json({
                message: "Login successful",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Enable 2-step: Send OTP
    enableTwoStep = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.authService.enable2StepVerification(req.body.email);

            return res.status(200).json({
                message: "OTP sent for 2-step verification",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Activate 2-step: Verify OTP and update database
    activateTwoStep = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.authService.verifyCodeActiveTwoStepVerification(
                req.body.email,
                req.body.code
            );

            return res.status(200).json({
                message: "2-step verification enabled successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Verify 2-step login OTP
    verifyTwoStep = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const tokens =
                await this.authService.verifyCodeTwoStepVerification(req.body);

            setCookies(res, tokens.accessToken, tokens.refreshToken);

            return res.status(200).json({
                message: "2-step verification successful",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Reset Password
    resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.authService.resetPassword(req.body);

            res.clearCookie("access_token", { path: "/" });
            res.clearCookie("refresh_token", { path: "/api/auth" });

            return res.status(200).json({
                message: "Password reset successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Google Login
    googleLogin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const tokens = await this.authService.loginWithGoogle(req.body);

            setCookies(res, tokens.accessToken, tokens.refreshToken);

            return res.status(200).json({
                message: "Google login successful",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Refresh Token
    refreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.cookies?.refresh_token;

            if (!token) {
                return res.status(401).json({
                    message: "No refresh token provided",
                    success: false
                });
            }

            const tokens = await this.authService.refreshTokenFn(token);

            setCookies(res, tokens.accessToken, tokens.refreshToken);

            return res.status(200).json({
                message: "Token refreshed successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // Logout
    logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.authService.logout(req.cookies?.refresh_token);

            res.clearCookie("access_token", { path: "/" });
            res.clearCookie("refresh_token", { path: "/api/auth" });

            return res.status(200).json({
                message: "Logout successful",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
