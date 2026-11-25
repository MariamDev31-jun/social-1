
import { model, Schema } from "mongoose";
import type { HydratedDocument, Model } from "mongoose";
import { Gender, Provider } from "../../auth/enum";
import type { IUser } from "../interface/user.interface";

export type UserDocument = HydratedDocument<IUser>;
export type UserModel = Model<IUser>;

const schema = new Schema<IUser, UserModel>(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 20
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            lowercase: true
        },

        password: {
            type: String,
            required: function () {
                return this.provider === Provider.LOCAL;
            },
            trim: true
        },

        provider: {
            type: Number,
            default: Provider.LOCAL,
            enum: Provider
        },

        gender: {
            type: Number,
            default: Gender.MALE,
            enum: Gender
        },

        role: {
            type: String,
            default: "user",
            trim: true
        },

        phoneNumber: {
            type: String,
            trim: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        twoStepVerification: {
            type: Boolean,
            default: false
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 300
        },

        profilePicture: {
            type: String,
            trim: true
        },

        isPrivate: {
            type: Boolean,
            default: false
        },

        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

export const User = model<IUser, UserModel>("User", schema);