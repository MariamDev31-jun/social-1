
import { container } from "tsyringe";

import { TOKENS } from "./tokens";

// User
import { UserService } from "../../app/user/service/user.service";
import { UserController } from "../../app/user/controller/user.controller";
import { UserRepository } from "../../app/user/repository/user.repository";

// Post
import { PostRepository } from "../../app/post/repository/post.repository";
import { PostService } from "../../app/post/service/post.service";
import { PostController } from "../../app/post/controller/post.controller";

// Comment
import { CommentRepository } from "../../app/comment/repository/comment.repository";
import { CommentService } from "../../app/comment/service/comment.service";
import { CommentController } from "../../app/comment/controller/comment.controller";

// Auth
import { AuthService } from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";

// Providers
import { s3CloudProvider } from "../cloud/init";
import { cacheProvider } from "../cache/init";
import { mailjetProvider } from "../email/init";

// Services
container.registerSingleton(TOKENS.UserService, UserService);
container.registerSingleton(TOKENS.PostService, PostService);
container.registerSingleton(TOKENS.CommentService, CommentService);
container.registerSingleton(TOKENS.AuthService, AuthService);

// Controllers
container.registerSingleton(TOKENS.UserController, UserController);
container.registerSingleton(TOKENS.PostController, PostController);
container.registerSingleton(TOKENS.CommentController, CommentController);
container.registerSingleton(TOKENS.AuthController, AuthController);

// Repositories
container.registerSingleton(TOKENS.UserRepository, UserRepository);
container.registerSingleton(TOKENS.PostRepository, PostRepository);
container.registerSingleton(TOKENS.CommentRepository, CommentRepository);

// External providers
container.registerInstance(TOKENS.CloudProvider, s3CloudProvider);
container.registerInstance(TOKENS.CacheProvider, cacheProvider);
container.registerInstance(TOKENS.MailjetProvider, mailjetProvider);

export { container };
