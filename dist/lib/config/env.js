"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const zod_1 = require("zod");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), ".env") });
const schema = zod_1.z.object({
    SERVER_PORT: zod_1.z.string().default("3000"),
    MONGODB_URI: zod_1.z.string(),
    NODEMAILER_EMAIL: zod_1.z.string().toLowerCase().trim(),
    NODEMAILER_PASSWORD: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    GOOGLE_WEB_OAUTH_CLIENT_ID: zod_1.z.string(),
    REDIS_HOST: zod_1.z.string(),
    REDIS_PORT: zod_1.z.string().default("6379"),
    REDIS_PASSWORD: zod_1.z.string(),
    MAILJET_API_KEY: zod_1.z.string(),
    MAILJET_API_SECRET: zod_1.z.string(),
    MAILJET_FROM_EMAIL: zod_1.z.string().trim().toLowerCase(),
    MAILJET_FROM_NAME: zod_1.z.string()
});
const parsed = schema.parse(process.env);
exports.env = {
    serverPort: Number(parsed.SERVER_PORT),
    db: {
        url: parsed.MONGODB_URI
    },
    nodemailer: {
        email: parsed.NODEMAILER_EMAIL,
        password: parsed.NODEMAILER_PASSWORD
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME
    },
    jwt: {
        secret: parsed.JWT_SECRET,
        refreshSecret: parsed.JWT_REFRESH_SECRET
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD || ""
    }
};
