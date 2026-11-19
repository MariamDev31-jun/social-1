"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./controller/user.controller"));
const authGuard_1 = require("../../lib/auth/authGuard");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/profile", authGuard_1.authGuard, user_controller_1.default.getProfile);
exports.userRouter.put("/profile", authGuard_1.authGuard, user_controller_1.default.updateProfile);
// Follow user
exports.userRouter.post("/:userId/follow", authGuard_1.authGuard, user_controller_1.default.followUser);
// Unfollow user
exports.userRouter.delete("/:userId/follow", authGuard_1.authGuard, user_controller_1.default.unfollowUser);
exports.userRouter.get("/search", authGuard_1.authGuard, user_controller_1.default.searchUsers);
exports.userRouter.get("/suggestions", authGuard_1.authGuard, user_controller_1.default.getSuggestions);
exports.userRouter.get("/:userId/profile", authGuard_1.authGuard, user_controller_1.default.getPublicProfile);
