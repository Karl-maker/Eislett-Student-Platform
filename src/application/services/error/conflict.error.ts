import HTTPError from "./http.error";

export default class ConflictError extends HTTPError {

    constructor(message: string, info?: any) {
        super(message, 409, info);
    }
}