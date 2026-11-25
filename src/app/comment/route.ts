
import { Router } from "express";

import { authGuard } from "../../lib/auth/authGuard";
import { commentController } from "./comment.di";

export const commentRouter = Router();

// Create comment on a post
commentRouter.post("/:postId", authGuard, commentController.createComment);

// Get all comments for a post
commentRouter.get("/post/:postId", authGuard, commentController.getPostComments);

// Get single comment
commentRouter.get("/:commentId", authGuard, commentController.getCommentById);

// Update comment
commentRouter.patch("/:commentId", authGuard, commentController.updateComment);

// Delete comment
commentRouter.delete("/:commentId", authGuard, commentController.deleteComment);
