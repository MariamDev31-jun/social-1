
import { injectable, inject } from "tsyringe";
import type { Request, Response, NextFunction } from "express";

import { CommentService } from "../service/comment.service";
import { TOKENS } from "../../../lib/di/tokens";
import type { TUserPayload } from "../../../lib/interface/user.payLoad";

@injectable()
export class CommentController {
    constructor(
        @inject(TOKENS.CommentService)
        private readonly commentService: CommentService
    ) {}

    // Create comment
    createComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;
            const { postId } = req.params;
            const { content } = req.body;

            const comment = await this.commentService.createComment(
                userId,
                postId as string,
                content
            );

            return res.status(201).json({
                message: "Comment created successfully",
                data: comment
            });
        } catch (error) {
            next(error);
        }
    };

    // Get comments for a post
    getPostComments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { postId } = req.params;

            const comments = await this.commentService.getPostComments(
                postId as string
            );

            return res.status(200).json({
                message: "Comments fetched successfully",
                data: comments
            });
        } catch (error) {
            next(error);
        }
    };

    // Get single comment
    getCommentById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { commentId } = req.params;

            const comment = await this.commentService.getCommentById(
                commentId as string
            );

            return res.status(200).json({
                message: "Comment fetched successfully",
                data: comment
            });
        } catch (error) {
            next(error);
        }
    };

    // Update comment
    updateComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;
            const { commentId } = req.params;
            const { content } = req.body;

            const comment = await this.commentService.updateComment(
                userId,
                commentId as string,
                content
            );

            return res.status(200).json({
                message: "Comment updated successfully",
                data: comment
            });
        } catch (error) {
            next(error);
        }
    };

    // Delete comment
    deleteComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;
            const { commentId } = req.params;

            await this.commentService.deleteComment(
                userId,
                commentId as string
            );

            return res.status(200).json({
                message: "Comment deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    };
}
