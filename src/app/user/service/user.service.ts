
import userRepository from "../repository/user.repository";
import type { IUser } from "../interface/user.interface";
import { AppError } from "../../../lib/error/error";

type UpdateProfileData = Pick<
    IUser,
    "userName" | "bio" | "profilePicture" | "phoneNumber" | "gender" | "isPrivate"
>;

export class UserService {
    private readonly userRepository = userRepository;

    // 1. Get current user's profile
    getProfile = async (userId: string) => {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    };

    // 2. Get another user's profile with privacy check
    getPublicProfile = async (
        targetUserId: string,
        currentUserId: string
    ) => {
        const targetUser = await this.userRepository.findProfileById(
            targetUserId
        );

        if (!targetUser) {
            throw new AppError("User not found", 404);
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
        const isFollower = (targetUser.followers ?? []).some(
            (followerId) => followerId.toString() === currentUserId
        );

        if (!isFollower) {
            throw new AppError("Private account", 403);
        }

        return targetUser;
    };

    // 3. Update user profile
    updateProfile = async (
        userId: string,
        updateData: UpdateProfileData
    ) => {
        const user = await this.userRepository.update(
            { _id: userId },
            updateData,
            { new: true }
        );

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    };

    // 4. Follow user
    followUser = async (
        currentUserId: string,
        targetUserId: string
    ) => {
        if (currentUserId === targetUserId) {
            throw new AppError("You cannot follow yourself", 400);
        }

        const [currentUser, targetUser] = await Promise.all([
            this.userRepository.findById(currentUserId),
            this.userRepository.findById(targetUserId)
        ]);

        if (!currentUser || !targetUser) {
            throw new AppError("User not found", 404);
        }

        await this.userRepository.addFollow(
            currentUserId,
            targetUserId
        );

        return {
            message: "User followed successfully"
        };
    };

    // 5. Unfollow user
    unfollowUser = async (
        currentUserId: string,
        targetUserId: string
    ) => {
        if (currentUserId === targetUserId) {
            throw new AppError("You cannot unfollow yourself", 400);
        }

        const [currentUser, targetUser] = await Promise.all([
            this.userRepository.findById(currentUserId),
            this.userRepository.findById(targetUserId)
        ]);

        if (!currentUser || !targetUser) {
            throw new AppError("User not found", 404);
        }

        await this.userRepository.removeFollow(
            currentUserId,
            targetUserId
        );

        return {
            message: "User unfollowed successfully"
        };
    };

    // 6. Search users
    searchUsers = async (
        search: string,
        currentUserId: string
    ) => {
        if (!search) {
            throw new AppError("Search query is required", 400);
        }

        const users = await this.userRepository.searchUsers(
            search,
            currentUserId
        );

        return users;
    };

    // 7. Get suggested users
    getSuggestions = async (currentUserId: string) => {
        const currentUser = await this.userRepository.findById(
            currentUserId
        );

        if (!currentUser) {
            throw new AppError("User not found", 404);
        }

        const followingIds = (currentUser.following ?? []).map(
            (id) => id.toString()
        );

        const suggestions = await this.userRepository.getSuggestions(
            currentUserId,
            followingIds
        );

        return suggestions;
    };
}

export default new UserService();
