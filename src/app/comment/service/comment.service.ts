
import { injectable, inject } from "tsyringe";
import { Types } from "mongoose";

import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../../post/repository/post.repository";

import { TOKENS } from "../../../lib/di/tokens";
import { AppError } from "../../../lib/error/error";

@injectable()
export class CommentService {
    constructor(
        @inject(TOKENS.CommentRepository)
        private readonly commentRepository: CommentRepository,

        @inject(TOKENS.PostRepository)
        private readonly postRepository: PostRepository
    ) {}

    // Create comment
    async createComment(
        userId: string,
        postId: string,
        content: string
    ) {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        if (!post.allowsComments) {
            throw new AppError("Comments are disabled for this post", 403);
        }

        const comment = await this.commentRepository.create({
            userId: new Types.ObjectId(userId),
            postId: new Types.ObjectId(postId),
            content
        });

        await this.postRepository.update(
            { _id: postId },
            { $inc: { commentsCount: 1 } }
        );

        return comment;
    }

    // Get comments for a post
    async getPostComments(postId: string) {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        return this.commentRepository.findPostComments(postId);
    }

    // Get single comment
    async getCommentById(commentId: string) {
        const comment = await this.commentRepository.findById(commentId);

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        return comment;
    }

    // Update comment
    async updateComment(
        userId: string,
        commentId: string,
        content: string
    ) {
        const comment = await this.commentRepository.findById(commentId);

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        if (comment.userId.toString() !== userId) {
            throw new AppError("You are not allowed to update this comment", 403);
        }

        return this.commentRepository.update(
            { _id: commentId, userId },
            { $set: { content } },
            { new: true }
        );
    }

    // Delete comment
    async deleteComment(userId: string, commentId: string) {
        const comment = await this.commentRepository.findById(commentId);

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        const post = await this.postRepository.findById(
            comment.postId.toString()
        );

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        const isCommentOwner = comment.userId.toString() === userId;
        const isPostOwner = post.userId.toString() === userId;

        if (!isCommentOwner && !isPostOwner) {
            throw new AppError("You are not allowed to delete this comment", 403);
        }

        const result = await this.commentRepository.delete({
            _id: commentId
        });

        if (result.deletedCount > 0) {
            await this.postRepository.update(
                { _id: comment.postId },
                { $inc: { commentsCount: -1 } }
            );
        }

        return result;
    }
}
