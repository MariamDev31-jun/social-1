
import { container } from "../../lib/di/container";
import { TOKENS } from "../../lib/di/tokens";
import { PostController } from "./controller/post.controller";

export const postController = container.resolve<PostController>(
    TOKENS.PostController
);
