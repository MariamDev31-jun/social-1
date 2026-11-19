
import { cacheProvider } from "../../../lib/cache/init";
import { env } from "../../../lib/config/env";
import { mailjetProvider } from "../../../lib/email/init";
import { AppError } from "../../../lib/error/error";
import { verifyGoogleToken } from "../../../lib/utils/google.auth";
import { generateOTPCode } from "../../../lib/utils/otp";
import type { TUserPayload } from "../../../lib/interface/user.payLoad";
import { toSeconds } from "../../../pkg/utils/time";

import {
    userAlreadyExist,
    userAlreadyVerified,
    userNotExist,
    userNotVerified
} from "../../user/error";

import userRepository, {
    UserRepository
} from "../../user/repository/user.repository";

import {
    invalidCode,
    invalidPassword,
    otpExpired
} from "../error";

import {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    hashPassword
} from "../utils";

import {
    LoginDto,
    RegisterDto,
    SendOtpDto,
    VerifyAccountDto,
    ResetPasswordDto,
    VerifyTwoStepDto,
    GoogleLoginDto
} from "../dto/dto";

import { Provider } from "../enum";
import type { TokenPayload } from "google-auth-library";

const jwt: any = require("jsonwebtoken");

export class AuthService {
    private readonly twoStepVerificationKey = "2-step-verification:";
    private readonly sendOtpKey = "otp:";
    private readonly refreshTokenKey = "refresh-token:";

    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = userRepository;
    }

    // Create and store a new session
    private async createSession(payload: TUserPayload) {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await cacheProvider.set(
            `${this.refreshTokenKey}${payload.id}`,
            refreshToken,
            toSeconds(7, "days")
        );

        return { accessToken, refreshToken };
    }

    // Register
    async register(registerDto: RegisterDto) {
        const email = registerDto.email.toLowerCase();

        const userExist = await this.userRepository.findByEmail(email);

        if (userExist) {
            throw userAlreadyExist;
        }

        const hashedPassword = await hashPassword(registerDto.password);

        const createdUser = await this.userRepository.create({
            ...registerDto,
            email,
            password: hashedPassword
        });

        const code = generateOTPCode();

        const otpKey = `${this.sendOtpKey}${createdUser._id.toString()}`;

        await cacheProvider.set(
            otpKey,
            code,
            toSeconds(3, "minutes")
        );

        await mailjetProvider.send(
            createdUser.email,
            "Verification Code",
            `<h1>Your verification code is ${code}</h1>`
        );

        const userObject = createdUser.toObject();
        const { password, ...safeUser } = userObject;

        return safeUser;
    }

    // Verify Account
    async verifyAccount(verifyAccountDto: VerifyAccountDto) {
        const email = verifyAccountDto.email.toLowerCase();

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw userNotExist;
        }

        if (user.isVerified) {
            throw userAlreadyVerified;
        }

        const otpKey = `${this.sendOtpKey}${user._id.toString()}`;
        const cacheCode = await cacheProvider.get(otpKey);

        if (!cacheCode) {
            throw otpExpired;
        }

        if (cacheCode !== verifyAccountDto.code) {
            throw invalidCode;
        }

        const updatedUser = await this.userRepository.update(
            { email: user.email },
            { isVerified: true },
            { new: true }
        );

        await cacheProvider.del(otpKey);

        if (!updatedUser) {
            throw userNotExist;
        }

        const userObject = updatedUser.toObject();
        const { password, ...safeUser } = userObject;

        return safeUser;
    }

    // Enable 2-step verification: send OTP
    async enable2StepVerification(email: string): Promise<void> {
        const code = generateOTPCode();

        await cacheProvider.set(
            `${this.twoStepVerificationKey}${email}`,
            code,
            toSeconds(3, "minutes")
        );

        await mailjetProvider.send(
            email,
            "2 Step Verification Code",
            `Your 2 step verification code is ${code}`
        );
    }

    // Activate 2-step verification after checking OTP
    async verifyCodeActiveTwoStepVerification(
        email: string,
        code: string
    ): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw userNotExist;
        }

        const otpKey = `${this.twoStepVerificationKey}${email}`;
        const cacheCode = await cacheProvider.get(otpKey);

        if (!cacheCode) {
            throw otpExpired;
        }

        if (cacheCode !== code) {
            throw invalidCode;
        }

        await this.userRepository.update(
            { email },
            { twoStepVerification: true }
        );

        await cacheProvider.del(otpKey);
    }

    // Login
    async login(
        loginDto: LoginDto
    ): Promise<{ accessToken?: string; refreshToken?: string } | void> {
        const email = loginDto.email.toLowerCase();
        const loginKey = `${email}:login`;

        const cachedAttempt = await cacheProvider.get(loginKey);

        if (cachedAttempt === "0") {
            throw new AppError(
                "You reached the maximum login attempts",
                429
            );
        }

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw userNotExist;
        }

        if (user.isVerified === false) {
            throw userNotVerified;
        }

        if (!user.password) {
            throw invalidPassword;
        }

        const match = await comparePassword(
            loginDto.password,
            user.password
        );

        if (!match) {
            const attempts = cachedAttempt
                ? parseInt(cachedAttempt, 10)
                : 5;

            const ttlRemaining = await cacheProvider.ttl(loginKey);

            const ttl = ttlRemaining > 0
                ? ttlRemaining
                : toSeconds(3, "minutes");

            const remainingAttempts = attempts - 1;

            await cacheProvider.set(
                loginKey,
                String(remainingAttempts),
                ttl
            );

            if (remainingAttempts === 0) {
                throw new AppError(
                    "You reached the maximum login attempts",
                    429
                );
            }

            throw invalidPassword;
        }

        await cacheProvider.del(loginKey);

        if (user.twoStepVerification === true) {
            const code = generateOTPCode();

            await cacheProvider.set(
                `${this.twoStepVerificationKey}${email}`,
                code,
                toSeconds(1, "minutes")
            );

            await mailjetProvider.send(
                email,
                "2 Step Verification Code",
                `<h3>Your code is ${code}</h3>`
            );

            return;
        }

        const payload: TUserPayload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email
        };

        return this.createSession(payload);
    }

    // Complete 2-step login
    async verifyCodeTwoStepVerification(
        verifyDto: VerifyTwoStepDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const email = verifyDto.email.toLowerCase();

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw userNotExist;
        }

        const otpKey = `${this.twoStepVerificationKey}${email}`;
        const cacheCode = await cacheProvider.get(otpKey);

        if (!cacheCode) {
            throw otpExpired;
        }

        if (cacheCode !== verifyDto.code) {
            throw invalidCode;
        }

        const payload: TUserPayload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email
        };

        await cacheProvider.del(otpKey);

        return this.createSession(payload);
    }

    // Send OTP
    async sendOtp(sendOtpDto: SendOtpDto): Promise<void> {
        const email = sendOtpDto.email.toLowerCase();

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw userNotExist;
        }

        const code = generateOTPCode();
        const otpKey = `${this.sendOtpKey}${user._id.toString()}`;

        await cacheProvider.set(
            otpKey,
            code,
            toSeconds(3, "minutes")
        );

        await mailjetProvider.send(
            email,
            "New OTP",
            `<p>Your new OTP is ${code}</p>`
        );
    }

    // Reset Password
    async resetPassword(resetDto: ResetPasswordDto): Promise<void> {
        const email = resetDto.email.toLowerCase();

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw userNotExist;
        }

        const otpKey = `${this.sendOtpKey}${user._id.toString()}`;
        const otp = await cacheProvider.get(otpKey);

        if (!otp) {
            throw otpExpired;
        }

        if (otp !== resetDto.code) {
            throw invalidCode;
        }

        const hashedPassword = await hashPassword(resetDto.newPassword);

        await this.userRepository.update(
            { email },
            { password: hashedPassword }
        );

        await cacheProvider.del(otpKey);

        // Revoke existing refresh token after password reset
        await cacheProvider.del(
            `${this.refreshTokenKey}${user._id.toString()}`
        );
    }

    // Google Login
    async loginWithGoogle(
        googleDto: GoogleLoginDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const googlePayload: TokenPayload | undefined =
            await verifyGoogleToken(googleDto.idToken);

        if (!googlePayload || !googlePayload.email) {
            throw new AppError(
                "No valid Google payload provided",
                400
            );
        }

        const email = googlePayload.email.toLowerCase();

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            const payload: TUserPayload = {
                id: existingUser._id.toString(),
                userName: existingUser.userName,
                email: existingUser.email
            };

            return this.createSession(payload);
        }

        const createdUser = await this.userRepository.create({
            userName: googlePayload.name || email.split("@")[0],
            email,
            provider: Provider.GOOGLE,
            isVerified: true
        });

        const payload: TUserPayload = {
            id: createdUser._id.toString(),
            userName: createdUser.userName,
            email: createdUser.email
        };

        return this.createSession(payload);
    }

    // Refresh Access Token + Rotate Refresh Token
    async refreshTokenFn(
        token: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        let decoded: any;

        try {
            decoded = jwt.verify(token, env.jwt.refreshSecret);
        } catch {
            throw new AppError("Invalid or expired refresh token", 401);
        }

        if (typeof decoded === "string" || !decoded.id) {
            throw new AppError("Invalid refresh token payload", 401);
        }

        const payload = decoded as TUserPayload;

        const storedToken = await cacheProvider.get(
            `${this.refreshTokenKey}${payload.id}`
        );

        if (!storedToken || storedToken !== token) {
            throw new AppError(
                "Refresh token has been revoked or is invalid",
                401
            );
        }

        const user = await this.userRepository.findById(payload.id);

        if (!user) {
            await cacheProvider.del(
                `${this.refreshTokenKey}${payload.id}`
            );

            throw userNotExist;
        }

        const newPayload: TUserPayload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email
        };

        return this.createSession(newPayload);
    }

    // Logout / Revoke Refresh Token
    async logout(token?: string): Promise<void> {
        if (!token) {
            return;
        }

        try {
            const decoded = jwt.verify(
                token,
                env.jwt.refreshSecret
            );

            if (decoded && typeof decoded !== "string" && decoded.id) {
                await cacheProvider.del(
                    `${this.refreshTokenKey}${decoded.id}`
                );
            }
        } catch {
            return;
        }
    }
}

export default new AuthService();
