"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const init_1 = require("../../../lib/cache/init");
const env_1 = require("../../../lib/config/env");
const init_2 = require("../../../lib/email/init");
const error_1 = require("../../../lib/error/error");
const google_auth_1 = require("../../../lib/utils/google.auth");
const otp_1 = require("../../../lib/utils/otp");
const time_1 = require("../../../pkg/utils/time");
const error_2 = require("../../user/error");
const user_repository_1 = __importDefault(require("../../user/repository/user.repository"));
const error_3 = require("../error");
const utils_1 = require("../utils");
const enum_1 = require("../enum");
const jwt = require("jsonwebtoken");
class AuthService {
    twoStepVerificationKey = "2-step-verification:";
    sendOtpKey = "otp:";
    refreshTokenKey = "refresh-token:";
    userRepository;
    constructor() {
        this.userRepository = user_repository_1.default;
    }
    // Create and store a new session
    async createSession(payload) {
        const accessToken = (0, utils_1.generateAccessToken)(payload);
        const refreshToken = (0, utils_1.generateRefreshToken)(payload);
        await init_1.cacheProvider.set(`${this.refreshTokenKey}${payload.id}`, refreshToken, (0, time_1.toSeconds)(7, "days"));
        return { accessToken, refreshToken };
    }
    // Register
    async register(registerDto) {
        const email = registerDto.email.toLowerCase();
        const userExist = await this.userRepository.findByEmail(email);
        if (userExist) {
            throw error_2.userAlreadyExist;
        }
        const hashedPassword = await (0, utils_1.hashPassword)(registerDto.password);
        const createdUser = await this.userRepository.create({
            ...registerDto,
            email,
            password: hashedPassword
        });
        const code = (0, otp_1.generateOTPCode)();
        const otpKey = `${this.sendOtpKey}${createdUser._id.toString()}`;
        await init_1.cacheProvider.set(otpKey, code, (0, time_1.toSeconds)(3, "minutes"));
        await init_2.mailjetProvider.send(createdUser.email, "Verification Code", `<h1>Your verification code is ${code}</h1>`);
        const userObject = createdUser.toObject();
        const { password, ...safeUser } = userObject;
        return safeUser;
    }
    // Verify Account
    async verifyAccount(verifyAccountDto) {
        const email = verifyAccountDto.email.toLowerCase();
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw error_2.userNotExist;
        }
        if (user.isVerified) {
            throw error_2.userAlreadyVerified;
        }
        const otpKey = `${this.sendOtpKey}${user._id.toString()}`;
        const cacheCode = await init_1.cacheProvider.get(otpKey);
        if (!cacheCode) {
            throw error_3.otpExpired;
        }
        if (cacheCode !== verifyAccountDto.code) {
            throw error_3.invalidCode;
        }
        const updatedUser = await this.userRepository.update({ email: user.email }, { isVerified: true }, { new: true });
        await init_1.cacheProvider.del(otpKey);
        if (!updatedUser) {
            throw error_2.userNotExist;
        }
        const userObject = updatedUser.toObject();
        const { password, ...safeUser } = userObject;
        return safeUser;
    }
    // Enable 2-step verification: send OTP
    async enable2StepVerification(email) {
        const code = (0, otp_1.generateOTPCode)();
        await init_1.cacheProvider.set(`${this.twoStepVerificationKey}${email}`, code, (0, time_1.toSeconds)(3, "minutes"));
        await init_2.mailjetProvider.send(email, "2 Step Verification Code", `Your 2 step verification code is ${code}`);
    }
    // Activate 2-step verification after checking OTP
    async verifyCodeActiveTwoStepVerification(email, code) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw error_2.userNotExist;
        }
        const otpKey = `${this.twoStepVerificationKey}${email}`;
        const cacheCode = await init_1.cacheProvider.get(otpKey);
        if (!cacheCode) {
            throw error_3.otpExpired;
        }
        if (cacheCode !== code) {
            throw error_3.invalidCode;
        }
        await this.userRepository.update({ email }, { twoStepVerification: true });
        await init_1.cacheProvider.del(otpKey);
    }
    // Login
    async login(loginDto) {
        const email = loginDto.email.toLowerCase();
        const loginKey = `${email}:login`;
        const cachedAttempt = await init_1.cacheProvider.get(loginKey);
        if (cachedAttempt === "0") {
            throw new error_1.AppError("You reached the maximum login attempts", 429);
        }
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw error_2.userNotExist;
        }
        if (user.isVerified === false) {
            throw error_2.userNotVerified;
        }
        if (!user.password) {
            throw error_3.invalidPassword;
        }
        const match = await (0, utils_1.comparePassword)(loginDto.password, user.password);
        if (!match) {
            const attempts = cachedAttempt
                ? parseInt(cachedAttempt, 10)
                : 5;
            const ttlRemaining = await init_1.cacheProvider.ttl(loginKey);
            const ttl = ttlRemaining > 0
                ? ttlRemaining
                : (0, time_1.toSeconds)(3, "minutes");
            const remainingAttempts = attempts - 1;
            await init_1.cacheProvider.set(loginKey, String(remainingAttempts), ttl);
            if (remainingAttempts === 0) {
                throw new error_1.AppError("You reached the maximum login attempts", 429);
            }
            throw error_3.invalidPassword;
        }
        await init_1.cacheProvider.del(loginKey);
        if (user.twoStepVerification === true) {
            const code = (0, otp_1.generateOTPCode)();
            await init_1.cacheProvider.set(`${this.twoStepVerificationKey}${email}`, code, (0, time_1.toSeconds)(1, "minutes"));
            await init_2.mailjetProvider.send(email, "2 Step Verification Code", `<h3>Your code is ${code}</h3>`);
            return;
        }
        const payload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email
        };
        return this.createSession(payload);
    }
    // Complete 2-step login
    async verifyCodeTwoStepVerification(verifyDto) {
        const email = verifyDto.email.toLowerCase();
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw error_2.userNotExist;
        }
        const otpKey = `${this.twoStepVerificationKey}${email}`;
        const cacheCode = await init_1.cacheProvider.get(otpKey);
        if (!cacheCode) {
            throw error_3.otpExpired;
        }
        if (cacheCode !== verifyDto.code) {
            throw error_3.invalidCode;
        }
        const payload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email
        };
        await init_1.cacheProvider.del(otpKey);
        return this.createSession(payload);
    }
    // Send OTP
    async sendOtp(sendOtpDto) {
        const email = sendOtpDto.email.toLowerCase();
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw error_2.userNotExist;
        }
        const code = (0, otp_1.generateOTPCode)();
        const otpKey = `${this.sendOtpKey}${user._id.toString()}`;
        await init_1.cacheProvider.set(otpKey, code, (0, time_1.toSeconds)(3, "minutes"));
        await init_2.mailjetProvider.send(email, "New OTP", `<p>Your new OTP is ${code}</p>`);
    }
    // Reset Password
    async resetPassword(resetDto) {
        const email = resetDto.email.toLowerCase();
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw error_2.userNotExist;
        }
        const otpKey = `${this.sendOtpKey}${user._id.toString()}`;
        const otp = await init_1.cacheProvider.get(otpKey);
        if (!otp) {
            throw error_3.otpExpired;
        }
        if (otp !== resetDto.code) {
            throw error_3.invalidCode;
        }
        const hashedPassword = await (0, utils_1.hashPassword)(resetDto.newPassword);
        await this.userRepository.update({ email }, { password: hashedPassword });
        await init_1.cacheProvider.del(otpKey);
        // Revoke existing refresh token after password reset
        await init_1.cacheProvider.del(`${this.refreshTokenKey}${user._id.toString()}`);
    }
    // Google Login
    async loginWithGoogle(googleDto) {
        const googlePayload = await (0, google_auth_1.verifyGoogleToken)(googleDto.idToken);
        if (!googlePayload || !googlePayload.email) {
            throw new error_1.AppError("No valid Google payload provided", 400);
        }
        const email = googlePayload.email.toLowerCase();
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            const payload = {
                id: existingUser._id.toString(),
                userName: existingUser.userName,
                email: existingUser.email
            };
            return this.createSession(payload);
        }
        const createdUser = await this.userRepository.create({
            userName: googlePayload.name || email.split("@")[0],
            email,
            provider: enum_1.Provider.GOOGLE,
            isVerified: true
        });
        const payload = {
            id: createdUser._id.toString(),
            userName: createdUser.userName,
            email: createdUser.email
        };
        return this.createSession(payload);
    }
    // Refresh Access Token + Rotate Refresh Token
    async refreshTokenFn(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, env_1.env.jwt.refreshSecret);
        }
        catch {
            throw new error_1.AppError("Invalid or expired refresh token", 401);
        }
        if (typeof decoded === "string" || !decoded.id) {
            throw new error_1.AppError("Invalid refresh token payload", 401);
        }
        const payload = decoded;
        const storedToken = await init_1.cacheProvider.get(`${this.refreshTokenKey}${payload.id}`);
        if (!storedToken || storedToken !== token) {
            throw new error_1.AppError("Refresh token has been revoked or is invalid", 401);
        }
        const user = await this.userRepository.findById(payload.id);
        if (!user) {
            await init_1.cacheProvider.del(`${this.refreshTokenKey}${payload.id}`);
            throw error_2.userNotExist;
        }
        const newPayload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email
        };
        return this.createSession(newPayload);
    }
    // Logout / Revoke Refresh Token
    async logout(token) {
        if (!token) {
            return;
        }
        try {
            const decoded = jwt.verify(token, env_1.env.jwt.refreshSecret);
            if (decoded && typeof decoded !== "string" && decoded.id) {
                await init_1.cacheProvider.del(`${this.refreshTokenKey}${decoded.id}`);
            }
        }
        catch {
            return;
        }
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
