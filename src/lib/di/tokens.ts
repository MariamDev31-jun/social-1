
export const TOKENS = {
    UserService: Symbol("UserService"),
    PostService: Symbol("PostService"),
    CommentService: Symbol("CommentService"),

    UserController: Symbol("UserController"),
    PostController: Symbol("PostController"),
    CommentController: Symbol("CommentController"),

    UserRepository: Symbol("UserRepository"),
    PostRepository: Symbol("PostRepository"),
    CommentRepository: Symbol("CommentRepository"),

    CloudProvider: Symbol("CloudProvider"),
    CacheProvider: Symbol("CacheProvider"),
    NodeMailerProvider: Symbol("NodeMailerProvider"),
    MailjetProvider: Symbol("MailjetProvider"),
    FirebaseProvider: Symbol("FirebaseProvider")
};
