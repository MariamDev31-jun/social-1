
import { Gender } from "../enum";

// Registration
export interface RegisterDto {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender?: Gender;
}

// Login
export interface LoginDto {
    email: string;
    password: string;
}

// Send OTP
export interface SendOtpDto {
    email: string;
}

// Verify account
export interface VerifyAccountDto {
    email: string;
    code: string;
}

// Reset password
export interface ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
}

// Verify 2-step login
export interface VerifyTwoStepDto {
    email: string;
    code: string;
}

// Google login
export interface GoogleLoginDto {
    idToken: string;
}
