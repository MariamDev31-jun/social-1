
import { config } from "dotenv";
import { resolve } from "path";
import { z } from "zod";

config({ path: resolve(process.cwd(), ".env") });

const schema = z.object({
    SERVER_PORT: z.string().default("3000"),
    MONGODB_URI: z.string(),

    NODEMAILER_EMAIL: z.string().toLowerCase().trim(),
    NODEMAILER_PASSWORD: z.string(),

    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),

    GOOGLE_WEB_OAUTH_CLIENT_ID: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().default("6379"),
    REDIS_PASSWORD: z.string(),

    MAILJET_API_KEY: z.string(),
    MAILJET_API_SECRET: z.string(),
    MAILJET_FROM_EMAIL: z.string().trim().toLowerCase(),
    MAILJET_FROM_NAME: z.string(),
    S3_REGION: z.string(),
    S3_BUCKET_NAME: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_ACCESS_KEY: z.string(),
});

const parsed = schema.parse(process.env);

export const env = {
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
    },
    aws: {
        secretKey: parsed.S3_SECRET_KEY,
        accessKey: parsed.S3_ACCESS_KEY,
        region: parsed.S3_REGION,
        bucketName: parsed.S3_BUCKET_NAME,
    },
};
