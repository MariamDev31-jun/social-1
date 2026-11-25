
import { Gender, Provider } from "../../auth/enum";
import { Types } from "mongoose";

export interface IUser {
    // Basic Information
    userName: string;
    email: string;
    password?: string;
    provider: Provider;
    gender: Gender;
    role?: string;
    phoneNumber?: string;

    // Account Status
    isVerified?: boolean;
    isDeleted?: boolean;
    twoStepVerification?: boolean;

    // Profile Information
    bio?: string;
    profilePicture?: string;
    isPrivate?: boolean;

    // Relationships
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];

    // Timestamps
    createdAt?: Date;
    updatedAt?: Date;
}

// A user as stored in MongoDB (always has an _id)
export interface IUserEntity extends IUser {
    _id: Types.ObjectId;
}
