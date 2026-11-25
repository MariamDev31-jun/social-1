
import { container } from "../../lib/di/container";
import { TOKENS } from "../../lib/di/tokens";
import { CommentController } from "./controller/comment.controller";

export const commentController = container.resolve<CommentController>(
    TOKENS.CommentController
);
