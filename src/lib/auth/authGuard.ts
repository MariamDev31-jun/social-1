
import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../error/error";
import { env } from "../config/env";

const jwt: any = require("jsonwebtoken");

export function authGuard(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        const token = req.cookies?.["access_token"];

        if (!token) {
            throw new AppError("No token provided", 401);
        }

        const decoded = jwt.verify(token, env.jwt.secret);

        if (typeof decoded === "string") {
            throw new AppError("Invalid token", 401);
        }

        req.user = decoded as JwtPayload;

        next();
    } catch (error) {
        next(error);
    }
}
