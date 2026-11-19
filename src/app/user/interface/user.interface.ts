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

    isVerified?: boolean;
    isDeleted?: boolean;
    twoStepVerification?: boolean;

    bio?: string;
    profilePicture?: string;
    isPrivate?: boolean;
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];
}