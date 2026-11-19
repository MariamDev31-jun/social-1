"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidPassword = exports.invalidCode = exports.otpExpired = void 0;
const error_js_1 = require("../../lib/error/error.js");
exports.otpExpired = new error_js_1.AppError("OTP expired, please resend OTP", 404);
exports.invalidCode = new error_js_1.AppError("invalid OTP", 403);
exports.invalidPassword = new error_js_1.AppError("invalid password", 403);
