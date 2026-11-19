
import type { Request, Response, NextFunction } from "express";

import userService, { UserService } from "../service/user.service";
import type { TUserPayload } from "../../../lib/interface/user.payLoad";
import { AppError } from "../../../lib/error/error";

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = userService;
    }

    // GET current user profile
    getProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const user = await this.userService.getProfile(currentUser.id);

            return res.status(200).json({
                message: "Profile retrieved successfully",
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    // UPDATE current user profile
    updateProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const {
                userName,
                bio,
                profilePicture,
                phoneNumber,
                gender,
                isPrivate
            } = req.body;

            const updatedUser = await this.userService.updateProfile(
                currentUser.id,
                {
                    userName,
                    bio,
                    profilePicture,
                    phoneNumber,
                    gender,
                    isPrivate
                }
            );

            // Convert Mongoose document to a normal object
            const safeUser = updatedUser.toObject();

            // Never return the password hash
            delete safeUser.password;

            return res.status(200).json({
                message: "Profile updated successfully",
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    // FOLLOW another user
    followUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const userId = String(req.params.userId);

            const result = await this.userService.followUser(
                currentUser.id,
                userId
            );

            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    };

    // UNFOLLOW another user
    unfollowUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const userId = String(req.params.userId);

            const result = await this.userService.unfollowUser(
                currentUser.id,
                userId
            );

            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    };

    // SEARCH USERS
    searchUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const search = String(req.query.query ?? "").trim();

            const users = await this.userService.searchUsers(
                search,
                currentUser.id
            );

            return res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data: users
            });
        } catch (error) {
            next(error);
        }
    };

    // GET USER SUGGESTIONS
    getSuggestions = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const suggestions = await this.userService.getSuggestions(
                currentUser.id
            );

            return res.status(200).json({
                success: true,
                message: "User suggestions retrieved successfully",
                data: suggestions
            });
        } catch (error) {
            next(error);
        }
    };

    // GET ANOTHER USER'S PROFILE
    getPublicProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const targetUserId = String(req.params.userId);

            const user = await this.userService.getPublicProfile(
                targetUserId,
                currentUser.id
            );

            return res.status(200).json({
                success: true,
                message: "Profile retrieved successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

}

export default new UserController();
