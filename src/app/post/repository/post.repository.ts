
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import { Post } from "../model/post.model";
import type { IPost } from "../model/post.model";

export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }

    async findById(postId: string) {
        return this.getOne({ _id: postId });
    }

    async findUserPosts(userId: string) {
        return this.model.find({ userId }).sort({ _id: -1 });
    }
}
