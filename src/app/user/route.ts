
import { Router } from "express";

import { container } from "../../lib/di/container";
import { TOKENS } from "../../lib/di/tokens";

import type { UserController } from "./controller/user.controller";

import { authGuard } from "../../lib/auth/authGuard";
import { multerUploadSingle } from "../../lib/media/multer";

export const userRouter = Router();

const userController = container.resolve<UserController>(
    TOKENS.UserController
);

// Get current user profile
userRouter.get(
    "/profile",
    authGuard,
    userController.getProfile
);

// Update current user profile
userRouter.put(
    "/profile",
    authGuard,
    userController.updateProfile
);

// Upload profile picture through backend
userRouter.post(
    "/upload-profile-pic",
    authGuard,
    multerUploadSingle("pp"),
    userController.uploadProfilePicture
);

// Generate Presigned URL using file metadata
userRouter.post(
    "/generate-presigned-url",
    authGuard,
    userController.generatePresignedUrl
);

// Follow user
userRouter.post(
    "/:userId/follow",
    authGuard,
    userController.followUser
);

// Unfollow user
userRouter.delete(
    "/:userId/follow",
    authGuard,
    userController.unfollowUser
);

// Search users
userRouter.get(
    "/search",
    authGuard,
    userController.searchUsers
);

// Get user suggestions
userRouter.get(
    "/suggestions",
    authGuard,
    userController.getSuggestions
);

// Get public user profile
userRouter.get(
    "/:userId/profile",
    authGuard,
    userController.getPublicProfile
);
