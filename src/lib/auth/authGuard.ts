import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../error/error";
import { env } from "../config/env";

export function authGuard(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        const token = req.cookies?.["access_token"];

        if (!token) {
            return next(new AppError("No token provided", 401));
        }

        const decoded = jwt.verify(token, env.jwt.secret);

        if (typeof decoded === "string") {
            return next(new AppError("Invalid token", 401));
        }

        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
}