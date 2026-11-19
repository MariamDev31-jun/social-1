"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../model/user.model");
const abstract_repository_1 = require("../../../lib/db/abstract.repository");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    // Find user by email
    async findByEmail(email) {
        return user_model_1.User.findOne({
            email: email.toLowerCase(),
            isDeleted: { $ne: true }
        });
    }
    // Find user by ID
    async findById(userId) {
        return user_model_1.User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select("-password");
    }
    // Find another user's profile by ID
    async findProfileById(userId) {
        return user_model_1.User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select("-password");
    }
    // Search users by username
    async searchUsers(search, currentUserId) {
        return user_model_1.User.find({
            _id: { $ne: currentUserId },
            isDeleted: { $ne: true },
            userName: {
                $regex: search,
                $options: "i"
            }
        }).select("-password");
    }
    // Follow user
    async addFollow(followerId, targetUserId) {
        await Promise.all([
            user_model_1.User.updateOne({ _id: followerId }, { $addToSet: { following: targetUserId } }),
            user_model_1.User.updateOne({ _id: targetUserId }, { $addToSet: { followers: followerId } })
        ]);
    }
    // Unfollow user
    async removeFollow(followerId, targetUserId) {
        await Promise.all([
            user_model_1.User.updateOne({ _id: followerId }, { $pull: { following: targetUserId } }),
            user_model_1.User.updateOne({ _id: targetUserId }, { $pull: { followers: followerId } })
        ]);
    }
    // Get suggested users
    async getSuggestions(currentUserId, followingIds) {
        return user_model_1.User.find({
            _id: {
                $nin: [currentUserId, ...followingIds]
            },
            isDeleted: { $ne: true }
        })
            .select("-password")
            .limit(10);
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
