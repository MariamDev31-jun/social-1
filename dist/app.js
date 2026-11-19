"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const route_1 = require("./route");
require("./lib/db/connection");
const error_1 = require("./lib/error/error");
function createApp() {
    const app = (0, express_1.default)();
    // Middlewares
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // Routes
    app.use("/api", route_1.router);
    // Global Error Handler
    app.use((error, req, res, _next) => {
        if (error instanceof error_1.AppError) {
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
