export default class HTTPError extends Error {
    public statusCode: number;
    public info: any;

    constructor(message: string, statusCode: number, info?: any) {
        super(message);
        this.statusCode = statusCode;
        this.info = info;

        // Set the prototype explicitly to maintain instanceof checks
        Object.setPrototypeOf(this, HTTPError.prototype);

        // Capture stack trace excluding constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}