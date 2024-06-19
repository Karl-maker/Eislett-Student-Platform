import HTTPError from "./http.error";

export default class NotFoundError extends HTTPError {

    constructor(message: string, info?: any) {
        super(message, 404, info);
    }
}