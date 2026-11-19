
import type { Model } from "mongoose";

import { User } from "../model/user.model";
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import type { IUser } from "../interface/user.interface";

export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User as unknown as Model<IUser>);
    }

    // Find user by email
    async findByEmail(email: string) {
        return User.findOne({
            email: email.toLowerCase(),
            isDeleted: { $ne: true }
        });
    }

    // Find user by ID
    async findById(userId: string) {
        return User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select("-password");
    }

    // Find another user's profile by ID
    async findProfileById(userId: string) {
        return User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select("-password");
    }

    // Search users by username
    async searchUsers(search: string, currentUserId: string) {
        return User.find({
            _id: { $ne: currentUserId },
            isDeleted: { $ne: true },
            userName: {
                $regex: search,
                $options: "i"
            }
        }).select("-password");
    }

    // Follow user
    async addFollow(followerId: string, targetUserId: string) {
        await Promise.all([
            User.updateOne(
                { _id: followerId },
                { $addToSet: { following: targetUserId } }
            ),
            User.updateOne(
                { _id: targetUserId },
                { $addToSet: { followers: followerId } }
            )
        ]);
    }

    // Unfollow user
    async removeFollow(followerId: string, targetUserId: string) {
        await Promise.all([
            User.updateOne(
                { _id: followerId },
                { $pull: { following: targetUserId } }
            ),
            User.updateOne(
                { _id: targetUserId },
                { $pull: { followers: followerId } }
            )
        ]);
    }

    // Get suggested users
    async getSuggestions(
        currentUserId: string,
        followingIds: string[]
    ) {
        return User.find({
            _id: {
                $nin: [currentUserId, ...followingIds]
            },
            isDeleted: { $ne: true }
        })
            .select("-password")
            .limit(10);
    }
}

export default new UserRepository();
