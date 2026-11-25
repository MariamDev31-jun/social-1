
import { User } from "../model/user.model";
import type { UserDocument } from "../model/user.model";
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import type { IUser } from "../interface/user.interface";

export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return User.findOne({
            email: email.toLowerCase(),
            isDeleted: { $ne: true }
        });
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select("-password");
    }

    async findProfileById(userId: string): Promise<UserDocument | null> {
        return User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select("-password");
    }

    async searchUsers(
        search: string,
        currentUserId: string
    ): Promise<UserDocument[]> {
        return User.find({
            _id: { $ne: currentUserId },
            isDeleted: { $ne: true },
            userName: {
                $regex: search,
                $options: "i"
            }
        }).select("-password");
    }

    async addFollow(
        followerId: string,
        targetUserId: string
    ): Promise<void> {
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

    async removeFollow(
        followerId: string,
        targetUserId: string
    ): Promise<void> {
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

    async getSuggestions(
        currentUserId: string,
        followingIds: string[]
    ): Promise<UserDocument[]> {
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
