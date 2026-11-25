
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { router } from "./route";
import "./lib/db/connection";
import { AppError } from "./lib/error/error";
import 'reflect-metadata'
export function createApp() {
    const app = express();

    // Middlewares
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/api", router);

    // Global Error Handler
    app.use((
        error: Error,
        req: Request,
        res: Response,
        _next: NextFunction
    ) => {

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false
            });
        }

        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    });

    return app;
}
