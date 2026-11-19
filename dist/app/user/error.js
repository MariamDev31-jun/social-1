"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAlreadyExist = exports.userNotVerified = exports.userAlreadyVerified = exports.userNotExist = void 0;
const error_js_1 = require("../../lib/error/error.js");
exports.userNotExist = new error_js_1.AppError("User Not Found", 404);
exports.userAlreadyVerified = new error_js_1.AppError("User Already Verified", 400);
exports.userNotVerified = new error_js_1.AppError("User Not Verified", 403);
exports.userAlreadyExist = new error_js_1.AppError("User Already Exist", 409);
