
import { model, Schema, Types } from "mongoose";
import type { Model } from "mongoose";

export interface IComment {
    content: string;
    userId: Types.ObjectId;
    postId: Types.ObjectId;
}

export type CommentModel = Model<IComment>;

const schema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 500
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Comment = model<IComment, CommentModel>(
    "Comment",
    schema
);
