
import { container } from "tsyringe";

import { UserService } from "../../app/user/service/user.service";
import { UserController } from "../../app/user/controller/user.controller";
import { UserRepository } from "../../app/user/repository/user.repository";

import { PostRepository } from "../../app/post/repository/post.repository";
import { PostService } from "../../app/post/service/post.service";
import { PostController } from "../../app/post/controller/post.controller";

import { CommentRepository } from "../../app/comment/repository/comment.repository";
import { CommentService } from "../../app/comment/service/comment.service";
import { CommentController } from "../../app/comment/controller/comment.controller";

import { TOKENS } from "./tokens";
import { s3CloudProvider } from "../cloud/init";
import { cacheProvider } from "../cache/init";

// Services
container.registerSingleton(TOKENS.UserService, UserService);
container.registerSingleton(TOKENS.PostService, PostService);
container.registerSingleton(TOKENS.CommentService, CommentService);

// Controllers
container.registerSingleton(TOKENS.UserController, UserController);
container.registerSingleton(TOKENS.PostController, PostController);
container.registerSingleton(TOKENS.CommentController, CommentController);

// Repositories
container.registerSingleton(TOKENS.UserRepository, UserRepository);
container.registerSingleton(TOKENS.PostRepository, PostRepository);
container.registerSingleton(TOKENS.CommentRepository, CommentRepository);

// External providers
container.registerInstance(TOKENS.CloudProvider, s3CloudProvider);
container.registerInstance(TOKENS.CacheProvider, cacheProvider);

export { container };
