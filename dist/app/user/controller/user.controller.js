"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user.service"));
const error_1 = require("../../../lib/error/error");
class UserController {
    userService;
    constructor() {
        this.userService = user_service_1.default;
    }
    // GET current user profile
    getProfile = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const user = await this.userService.getProfile(currentUser.id);
            return res.status(200).json({
                message: "Profile retrieved successfully",
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    };
    // UPDATE current user profile
    updateProfile = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const { userName, bio, profilePicture, phoneNumber, gender, isPrivate } = req.body;
            const updatedUser = await this.userService.updateProfile(currentUser.id, {
                userName,
                bio,
                profilePicture,
                phoneNumber,
                gender,
                isPrivate
            });
            // Convert Mongoose document to a normal object
            const safeUser = updatedUser.toObject();
            // Never return the password hash
            delete safeUser.password;
            return res.status(200).json({
                message: "Profile updated successfully",
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    };
    // FOLLOW another user
    followUser = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const userId = String(req.params.userId);
            const result = await this.userService.followUser(currentUser.id, userId);
            return res.status(200).json({
                success: true,
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    };
    // UNFOLLOW another user
    unfollowUser = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const userId = String(req.params.userId);
            const result = await this.userService.unfollowUser(currentUser.id, userId);
            return res.status(200).json({
                success: true,
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    };
    // SEARCH USERS
    searchUsers = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const search = String(req.query.query ?? "").trim();
            const users = await this.userService.searchUsers(search, currentUser.id);
            return res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data: users
            });
        }
        catch (error) {
            next(error);
        }
    };
    // GET USER SUGGESTIONS
    getSuggestions = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const suggestions = await this.userService.getSuggestions(currentUser.id);
            return res.status(200).json({
                success: true,
                message: "User suggestions retrieved successfully",
                data: suggestions
            });
        }
        catch (error) {
            next(error);
        }
    };
    // GET ANOTHER USER'S PROFILE
    getPublicProfile = async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser?.id) {
                throw new error_1.AppError("Unauthorized", 401);
            }
            const targetUserId = String(req.params.userId);
            const user = await this.userService.getPublicProfile(targetUserId, currentUser.id);
            return res.status(200).json({
                success: true,
                message: "Profile retrieved successfully",
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new UserController();
