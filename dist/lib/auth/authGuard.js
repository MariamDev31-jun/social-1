"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const error_1 = require("../error/error");
const env_1 = require("../config/env");
const jwt = require("jsonwebtoken");
function authGuard(req, res, next) {
    try {
        const token = req.cookies?.["access_token"];
        if (!token) {
            throw new error_1.AppError("No token provided", 401);
        }
        const decoded = jwt.verify(token, env_1.env.jwt.secret);
        if (typeof decoded === "string") {
            throw new error_1.AppError("Invalid token", 401);
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
}
