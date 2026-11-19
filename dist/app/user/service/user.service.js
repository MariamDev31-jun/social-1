"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = __importDefault(require("../repository/user.repository"));
const error_1 = require("../../../lib/error/error");
class UserService {
    userRepository = user_repository_1.default;
    // 1. Get current user's profile
    getProfile = async (userId) => {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new error_1.AppError("User not found", 404);
        }
        return user;
    };
    // 2. Get another user's profile with privacy check
    getPublicProfile = async (targetUserId, currentUserId) => {
        const targetUser = await this.userRepository.findProfileById(targetUserId);
        if (!targetUser) {
            throw new error_1.AppError("User not found", 404);
        }
        // Public profiles are visible to everyone
        if (!targetUser.isPrivate) {
            return targetUser;
        }
        // The owner can always view their own profile
        if (targetUserId === currentUserId) {
            return targetUser;
        }
        // Check if current user follows the private account
        const isFollower = (targetUser.followers ?? []).some((followerId) => followerId.toString() === currentUserId);
        if (!isFollower) {
            throw new error_1.AppError("Private account", 403);
        }
        return targetUser;
    };
    // 3. Update user profile
    updateProfile = async (userId, updateData) => {
        const user = await this.userRepository.update({ _id: userId }, updateData, { new: true });
        if (!user) {
            throw new error_1.AppError("User not found", 404);
        }
        return user;
    };
    // 4. Follow user
    followUser = async (currentUserId, targetUserId) => {
        if (currentUserId === targetUserId) {
            throw new error_1.AppError("You cannot follow yourself", 400);
        }
        const [currentUser, targetUser] = await Promise.all([
            this.userRepository.findById(currentUserId),
            this.userRepository.findById(targetUserId)
        ]);
        if (!currentUser || !targetUser) {
            throw new error_1.AppError("User not found", 404);
        }
        await this.userRepository.addFollow(currentUserId, targetUserId);
        return {
            message: "User followed successfully"
        };
    };
    // 5. Unfollow user
    unfollowUser = async (currentUserId, targetUserId) => {
        if (currentUserId === targetUserId) {
            throw new error_1.AppError("You cannot unfollow yourself", 400);
        }
        const [currentUser, targetUser] = await Promise.all([
            this.userRepository.findById(currentUserId),
            this.userRepository.findById(targetUserId)
        ]);
        if (!currentUser || !targetUser) {
            throw new error_1.AppError("User not found", 404);
        }
        await this.userRepository.removeFollow(currentUserId, targetUserId);
        return {
            message: "User unfollowed successfully"
        };
    };
    // 6. Search users
    searchUsers = async (search, currentUserId) => {
        if (!search) {
            throw new error_1.AppError("Search query is required", 400);
        }
        const users = await this.userRepository.searchUsers(search, currentUserId);
        return users;
    };
    // 7. Get suggested users
    getSuggestions = async (currentUserId) => {
        const currentUser = await this.userRepository.findById(currentUserId);
        if (!currentUser) {
            throw new error_1.AppError("User not found", 404);
        }
        const followingIds = (currentUser.following ?? []).map((id) => id.toString());
        const suggestions = await this.userRepository.getSuggestions(currentUserId, followingIds);
        return suggestions;
    };
}
exports.UserService = UserService;
exports.default = new UserService();
