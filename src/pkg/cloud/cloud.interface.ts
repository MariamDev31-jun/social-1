
export interface S3Config {
    region: string;
    accessKey: string;
    secretKey: string;
    bucketName: string;
}

export interface PresignedUpload {
    url: string;
    key: string;
}

export interface UploadFileMetadata {
    fileName: string;
    contentType: string;
}

export interface ICloudProvider {
    uploadFile(
        file: Express.Multer.File,
        path: string
    ): Promise<string>;

    deleteFile(key: string): Promise<void>;

    getFile(key: string): Promise<Buffer>;

    generatePresignedUrl(
        file: UploadFileMetadata,
        path: string
    ): Promise<PresignedUpload>;
}
