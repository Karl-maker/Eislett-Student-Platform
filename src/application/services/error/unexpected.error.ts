import HTTPError from "./http.error";

export default class UnexpectedError extends HTTPError {

    constructor(message: string, info?: any) {
        super(message, 500, info);
    }
}