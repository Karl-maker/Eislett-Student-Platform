import { NextFunction, Request, Response } from 'express';
import UnexpectedError from '../../../application/services/error/unexpected.error';
import logger from '../../../application/services/log';
import NotFoundError from '../../../application/services/error/not.found.error';
import HTTPError from '../../../application/services/error/http.error';

const errorHandler = (err: NotFoundError | UnexpectedError | Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof HTTPError) {
        if(err.statusCode !== 500) {
            logger.error(`${err.statusCode} - ${err.message}`, err);

            res.status(err.statusCode).json({
                error: err.message
            })
        } else if (err.statusCode === 500) {
            logger.error(`(Captured Unexpected Error) - ${err.message}`, err);
    
            res.status(500).json({
                error: 'Unexpected Issue Occured'
            })
        } 
    } else {
        logger.error(`(Uncaptured Unexpected Error) - ${err.message}`, err);
        res.status(500).json({ error: 'Unexpected Issue Occured' });
    }
};

export default errorHandler;