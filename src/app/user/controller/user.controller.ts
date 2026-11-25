
import type { Request, Response, NextFunction } from "express";

import { injectable, inject } from "tsyringe";
import type { UserService } from "../service/user.service";
import type { TUserPayload } from "../../../lib/interface/user.payLoad";
import { AppError } from "../../../lib/error/error";
import { toSafeUser } from "../../auth/utils";
import { TOKENS } from "../../../lib/di/tokens";

@injectable()
export class UserController {
    constructor(
        @inject(TOKENS.UserService)
        private readonly userService: UserService
    ) {}

    // GET current user profile
    getProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                return next(new AppError("Unauthorized", 401));
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
                return next(new AppError("Unauthorized", 401));
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

            const safeUser = toSafeUser(updatedUser);

            return res.status(200).json({
                message: "Profile updated successfully",
                success: true,
                data: safeUser
            });
        } catch (error) {
            next(error);
        }
    };

    // UPLOAD profile picture through backend
    uploadProfilePicture = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                return next(new AppError("Unauthorized", 401));
            }

            if (!req.file) {
                return next(
                    new AppError("Profile picture file is required", 400)
                );
            }

            const key = await this.userService.uploadProfilePicture(
                req.file,
                currentUser.id
            );

            return res.status(200).json({
                success: true,
                message: "Profile picture uploaded successfully",
                data: { key }
            });
        } catch (error) {
            next(error);
        }
    };

    // GENERATE Presigned URL using file metadata
    generatePresignedUrl = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUser = req.user as TUserPayload;

            if (!currentUser?.id) {
                return next(new AppError("Unauthorized", 401));
            }

            const { fileName, contentType } = req.body as {
                fileName?: string;
                contentType?: string;
            };

            if (
                typeof fileName !== "string" ||
                !fileName.trim() ||
                typeof contentType !== "string" ||
                !contentType.trim()
            ) {
                return next(
                    new AppError(
                        "fileName and contentType are required",
                        400
                    )
                );
            }

            const upload = await this.userService.generatePresignedUrl(
                {
                    fileName: fileName.trim(),
                    contentType: contentType.trim()
                },
                currentUser.id
            );

            return res.status(200).json({
                success: true,
                message: "Presigned URL generated successfully",
                data: {
                    url: upload.url,
                    key: upload.key
                }
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
                return next(new AppError("Unauthorized", 401));
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
                return next(new AppError("Unauthorized", 401));
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
                return next(new AppError("Unauthorized", 401));
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
                return next(new AppError("Unauthorized", 401));
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
                return next(new AppError("Unauthorized", 401));
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
