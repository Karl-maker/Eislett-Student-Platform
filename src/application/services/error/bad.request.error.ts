import HTTPError from "./http.error";

export default class BadRequestError extends HTTPError {

    constructor(message: string, info?: any) {
        super(message, 401, info);
    }
}