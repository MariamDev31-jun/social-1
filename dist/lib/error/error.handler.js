"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
function globalErrorHandler(err, req, res, _next) {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message, // >> 'user already exist' | 'user not found' >> Client >> 'Assignment'
            success: false,
        });
    }
    return res.status(500).json({
        message: 'Something went wrong',
        success: false,
    });
}
