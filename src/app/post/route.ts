
import { Router } from "express";

import { authGuard } from "../../lib/auth/authGuard";
import { postController } from "./post.di";

export const postRouter = Router();

// Create post
postRouter.post("/", authGuard, postController.createPost);

// Get my posts
postRouter.get("/", authGuard, postController.getUserPosts);

// Get single post
postRouter.get("/:postId", authGuard, postController.getPostById);

// Update post
postRouter.patch("/:postId", authGuard, postController.updatePost);

// Delete post
postRouter.delete("/:postId", authGuard, postController.deletePost);
