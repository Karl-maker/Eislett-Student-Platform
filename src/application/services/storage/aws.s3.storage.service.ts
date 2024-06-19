import { S3 as AWSS3, AWSError } from 'aws-sdk';
import { PutObjectRequest, DeleteObjectRequest, GetObjectRequest, GetObjectOutput } from 'aws-sdk/clients/s3';
import Storage, { StorageResults, StorageError } from './interface.storage.service'; // Adjust the path as needed

export default class S3 implements Storage {
    private s3: AWSS3;
    private bucketName: string;

    constructor(bucketName: string, region: string) {
        this.s3 = new AWSS3({ region });
        this.bucketName = bucketName;
    }

    public async upload(buffer: Buffer, extension: string): Promise<StorageResults> {
        const key = this.generateKey(extension);
        const params: PutObjectRequest = {
            Bucket: this.bucketName,
            Key: key,
            Body: buffer
        };

        try {
            const data = await this.s3.upload(params).promise();
            return { location: data.Location, key: data.Key };
        } catch (error) {
            throw this.handleError(error as AWSError);
        }
    }

    public async remove(key: string): Promise<boolean> {
        const params: DeleteObjectRequest = {
            Bucket: this.bucketName,
            Key: key
        };

        try {
            await this.s3.deleteObject(params).promise();
            return true;
        } catch (error) {
            throw this.handleError(error as AWSError);
        }
    }

    public async replace(buffer: Buffer, key: string, extension: string): Promise<StorageResults> {
        const filePath = this.generateKey(extension);
        const params: PutObjectRequest = {
            Bucket: this.bucketName,
            Key: filePath,
            Body: buffer
        };

        try {
            const data = await this.s3.upload(params).promise();
            return { location: data.Location, key: data.Key };
        } catch (error) {
            throw this.handleError(error as AWSError);
        }
    }

    public async retrieve(key: string): Promise<Buffer> {
        const params: GetObjectRequest = {
            Bucket: this.bucketName,
            Key: key
        };

        try {
            const data: GetObjectOutput = await this.s3.getObject(params).promise();
            if (data.Body instanceof Buffer) {
                return data.Body;
            } else {
                throw new Error('Unexpected data type returned from S3');
            }
        } catch (error) {
            throw this.handleError(error as AWSError);
        }
    }

    private generateKey(extension: string): string {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    }

    private handleError(error: AWSError): StorageError {
        return { message: error.message, code: error.statusCode };
    }
}