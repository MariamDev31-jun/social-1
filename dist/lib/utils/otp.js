"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTPCode = generateOTPCode;
const crypto_1 = __importDefault(require("crypto"));
function generateOTPCode(length = 6) {
    const max = 10 ** length;
    return crypto_1.default.randomInt(0, max).toString().padStart(length, '0');
}
