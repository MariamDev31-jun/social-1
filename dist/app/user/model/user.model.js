"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../auth/enum");
const schema = new mongoose_1.Schema({
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
            return this.provider === enum_1.Provider.LOCAL;
        },
        trim: true
    },
    provider: {
        type: Number,
        default: enum_1.Provider.LOCAL,
        enum: enum_1.Provider
    },
    gender: {
        type: Number,
        default: enum_1.Gender.MALE,
        enum: enum_1.Gender
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
});
exports.User = (0, mongoose_1.model)("User", schema);
