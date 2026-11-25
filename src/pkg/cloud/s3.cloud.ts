
import type {
    ICloudProvider,
    PresignedUpload,
    S3Config,
    UploadFileMetadata
} from "./cloud.interface";

import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";

import type { S3ClientConfig } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { toSeconds } from "../utils/time";

export class S3CloudProvider implements ICloudProvider {
    private readonly client: S3Client;
    private readonly bucket: string;

    constructor(config: S3Config) {
        const clientConfig: S3ClientConfig = {
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey
            }
        };

        // noinspection JSCheckFunctionSignatures,TypeScriptValidateTypes
        this.client = new S3Client(clientConfig);

        this.bucket = config.bucketName;
    }

    private buildKey(fileName: string, path: string): string {
        return `${path}/${Date.now()}-${fileName}`;
    }

    // DELETE FILE
    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        await this.client.send(command);
    }

    // GET FILE
    async getFile(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        const response = await this.client.send(command);

        // noinspection JSUnresolvedReference,TypeScriptUnresolvedReference
        const body = response.Body;

        if (!body) {
            throw new Error(`S3 object "${key}" has no readable body`);
        }

        const bytes = await body.transformToByteArray();

        return Buffer.from(bytes);
    }

    // UPLOAD FILE THROUGH BACKEND
    async uploadFile(
        file: Express.Multer.File,
        path: string
    ): Promise<string> {
        const key = this.buildKey(file.originalname, path);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        });

        await this.client.send(command);

        return key;
    }

    // GENERATE PRESIGNED URL
    async generatePresignedUrl(
        file: UploadFileMetadata,
        path: string
    ): Promise<PresignedUpload> {
        const key = this.buildKey(file.fileName, path);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: file.contentType
        });

        const url = await getSignedUrl(this.client, command, {
            expiresIn: toSeconds(1, "minutes")
        });

        return {
            url,
            key
        };
    }
}
