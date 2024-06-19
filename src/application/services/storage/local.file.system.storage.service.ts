import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import Storage, { StorageResults, StorageError } from './interface.storage.service'; // Adjust the path as needed

export default class LocalFileSystem implements Storage {
    private rootDir: string;

    constructor(rootDir: string = 'temp') {
        this.rootDir = resolve(process.cwd(), rootDir);
        this.initializeDirectory();
    }

    private async initializeDirectory(): Promise<void> {
        try {
            await fs.mkdir(this.rootDir, { recursive: true });
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async upload(buffer: Buffer, ext: string): Promise<StorageResults> {
        const key = this.generateKey(ext);
        const filePath = this.getFilePath(key);

        try {
            await fs.writeFile(filePath, buffer);
            return { location: filePath, key: key };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async remove(key: string): Promise<boolean> {
        const filePath = this.getFilePath(key);

        try {
            await fs.unlink(filePath);
            return true;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return false; // File does not exist
            }
            throw this.handleError(error);
        }
    }

    public async replace(buffer: Buffer, key: string, extension: string): Promise<StorageResults> {
        const filePath = this.getFilePath(key);

        try {
            await fs.writeFile(filePath, buffer);
            return { location: filePath, key: key };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async retrieve(key: string): Promise<Buffer> {
        const filePath = this.getFilePath(key);

        try {
            const data = await fs.readFile(filePath);
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async cleanup(): Promise<boolean> {
        try {
            const files = await fs.readdir(this.rootDir);
            for (const file of files) {
                await fs.unlink(this.getFilePath(file));
            }
            return true;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private getFilePath(key: string): string {
        return join(this.rootDir, key);
    }

    private generateKey(extension: string): string {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    }

    private handleError(error: any): StorageError {
        return { message: error.message, code: error.code };
    }
}