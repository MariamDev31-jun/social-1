"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.refreshToken = refreshToken;
exports.setCookies = setCookies;
const argon2_1 = __importDefault(require("argon2"));
const env_1 = require("../../lib/config/env");
const time_1 = require("../../pkg/utils/time");
const jwt = require("jsonwebtoken");
async function hashPassword(password) {
    return argon2_1.default.hash(password);
}
async function comparePassword(password, hashedPassword) {
    return argon2_1.default.verify(hashedPassword, password);
}
function generateAccessToken(payload) {
    return jwt.sign(payload, env_1.env.jwt.secret, {
        expiresIn: (0, time_1.toSeconds)(15, "minutes")
    });
}
function generateRefreshToken(payload) {
    return jwt.sign(payload, env_1.env.jwt.refreshSecret, {
        expiresIn: (0, time_1.toSeconds)(7, "days")
    });
}
function refreshToken(payload) {
    return generateRefreshToken(payload);
}
function setCookies(res, accessToken, refreshTokenStr) {
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: (0, time_1.toMs)(15, "minutes"),
        path: "/"
    });
    res.cookie("refresh_token", refreshTokenStr, {
        httpOnly: true,
        maxAge: (0, time_1.toMs)(7, "days"),
        path: "/api/auth"
    });
}
