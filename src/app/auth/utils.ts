
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { TUserPayload } from "../../lib/interface/user.payLoad";
import type { IUserEntity } from "../user/interface/user.interface";
import type { UserDocument } from "../user/model/user.model";

import { env } from "../../lib/config/env";
import { toMs, toSeconds } from "../../pkg/utils/time";

// Plain user object without the password hash
export type SafeUser = Omit<IUserEntity, "password">;

export function toSafeUser(user: UserDocument): SafeUser {
    const { password: _password, ...safeUser } = user.toObject<IUserEntity>();

    return safeUser;
}

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
}

export function generateAccessToken(payload: TUserPayload): string {
    return jwt.sign(payload, env.jwt.secret, {
        expiresIn: toSeconds(15, "minutes")
    });
}

export function generateRefreshToken(payload: TUserPayload): string {
    return jwt.sign(payload, env.jwt.refreshSecret, {
        expiresIn: toSeconds(7, "days")
    });
}

export function refreshToken(payload: TUserPayload): string {
    return generateRefreshToken(payload);
}

export function setCookies(
    res: Response,
    accessToken: string,
    refreshTokenStr: string
): void {
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: toMs(15, "minutes"),
        path: "/"
    });

    res.cookie("refresh_token", refreshTokenStr, {
        httpOnly: true,
        maxAge: toMs(7, "days"),
        path: "/api/auth"
    });
}
