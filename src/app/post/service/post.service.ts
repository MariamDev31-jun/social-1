import { injectable, inject } from "tsyringe";
import { Types } from "mongoose";
import { PostRepository } from "../repository/post.repository";
import { TOKENS } from "../../../lib/di/tokens";
import { AppError } from "../../../lib/error/error";

@injectable()
export class PostService {
    constructor(
        @inject(TOKENS.PostRepository)
        private readonly postRepository: PostRepository
    ) {}

    async createPost(userId: string, content: string) {
        return this.postRepository.create({
            userId: new Types.ObjectId(userId),
            content
        });
    }

    async getUserPosts(userId: string) {
        return this.postRepository.findUserPosts(userId);
    }

    async getPostById(postId: string) {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        return post;
    }

    async updatePost(
        userId: string,
        postId: string,
        content: string
    ) {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        if (post.userId.toString() !== userId) {
            throw new AppError("You are not allowed to update this post", 403);
        }

        return this.postRepository.update(
            { _id: postId, userId },
            { $set: { content } },
            { new: true }
        );
    }

    async deletePost(userId: string, postId: string) {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        if (post.userId.toString() !== userId) {
            throw new AppError("You are not allowed to delete this post", 403);
        }

        return this.postRepository.delete({
            _id: postId,
            userId
        });
    }
}