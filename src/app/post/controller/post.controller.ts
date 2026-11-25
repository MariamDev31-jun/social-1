
import { injectable, inject } from "tsyringe";
import type { Request, Response, NextFunction } from "express";

import { PostService } from "../service/post.service";
import { TOKENS } from "../../../lib/di/tokens";
import type { TUserPayload } from "../../../lib/interface/user.payLoad";

@injectable()
export class PostController {
    constructor(
        @inject(TOKENS.PostService)
        private readonly postService: PostService
    ) {}

    // Create Post
    createPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;
            const { content } = req.body;

            const post = await this.postService.createPost(userId, content);

            return res.status(201).json({
                message: "Post created successfully",
                data: post
            });
        } catch (error) {
            next(error);
        }
    };

    // Get my posts
    getUserPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;

            const posts = await this.postService.getUserPosts(userId);

            return res.status(200).json({
                message: "Posts fetched successfully",
                data: posts
            });
        } catch (error) {
            next(error);
        }
    };

    // Get single post
    getPostById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const postId = req.params.postId as string;

            const post = await this.postService.getPostById(postId);

            return res.status(200).json({
                message: "Post fetched successfully",
                data: post
            });
        } catch (error) {
            next(error);
        }
    };

    // Update post
    updatePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;
            const postId = req.params.postId as string;
            const { content } = req.body;

            const post = await this.postService.updatePost(
                userId,
                postId,
                content
            );

            return res.status(200).json({
                message: "Post updated successfully",
                data: post
            });
        } catch (error) {
            next(error);
        }
    };

    // Delete post
    deletePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user as TUserPayload;
            const postId = req.params.postId as string;

            await this.postService.deletePost(userId, postId);

            return res.status(200).json({
                message: "Post deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    };
}
