export type StorageResults = {
    location: string;
    key: string;
};

export type StorageError = {
    message: string;
    code?: number;
};

export default interface Storage {
    /**
     * Uploads a file buffer to the storage service.
     * @param buffer - The file buffer to upload.
     * @returns A promise that resolves to the location and key of the uploaded file.
     * @throws StorageError if the upload fails.
     */
    upload(buffer: Buffer, ext: string): Promise<StorageResults>;

    /**
     * Removes a file from the storage service.
     * @param key - The key of the file to remove.
     * @returns A promise that resolves to `true` if the file was successfully removed, `false` otherwise.
     * @throws StorageError if the removal fails.
     */
    remove(key: string): Promise<boolean>;

    /**
     * Replaces an existing file in the storage service with a new file buffer.
     * @param buffer - The new file buffer to upload.
     * @param key - The key of the file to replace.
     * @returns A promise that resolves to the location and key of the replaced file.
     * @throws StorageError if the replacement fails.
     */
    replace(buffer: Buffer, key: string, ext: string): Promise<StorageResults>;

    /**
     * Retrieves a file from the storage service.
     * @param key - The key of the file to retrieve.
     * @returns A promise that resolves to the file data as a buffer.
     * @throws StorageError if the retrieval fails.
     */
    retrieve(key: string): Promise<Buffer>;
}