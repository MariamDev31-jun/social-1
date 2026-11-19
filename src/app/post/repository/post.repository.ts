import {AbstractRepository} from "../../../lib/db/abstract.repository";
import {IPost, Post} from "../model/post.model";


class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }
}

// singleton
export default new PostRepository();