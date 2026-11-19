import {Router} from "express";
import userController from "./controller/user.controller";
import {authGuard} from "../../lib/auth/authGuard";

export const userRouter = Router();

userRouter.get("/profile", authGuard, userController.getProfile);

userRouter.put("/profile", authGuard, userController.updateProfile);
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
userRouter.get(
    "/search",
    authGuard,
    userController.searchUsers
);
userRouter.get(
    "/suggestions",
    authGuard,
    userController.getSuggestions
);
userRouter.get(
    "/:userId/profile",
    authGuard,
    userController.getPublicProfile
);