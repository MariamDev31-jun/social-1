
import { AbstractRepository } from "../../../lib/db/abstract.repository";

import { Comment } from "../model/comment.model";
import type { IComment } from "../model/comment.model";

export class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findById(commentId: string) {
        return this.getOne({ _id: commentId });
    }

    async findPostComments(postId: string) {
        return this.model
            .find({ postId })
            .sort({ _id: -1 });
    }

    async findCommentByIdAndPost(
        commentId: string,
        postId: string
    ) {
        return this.getOne({
            _id: commentId,
            postId
        });
    }
}
