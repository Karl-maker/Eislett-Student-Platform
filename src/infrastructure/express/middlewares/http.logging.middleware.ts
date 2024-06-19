import { NextFunction, Request, Response } from 'express';
import logger from '../../../application/services/log';

const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    const startHrTime = process.hrtime();
    
    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        
        logger.debug(
            `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsedTimeInMs.toFixed(3)} ms`
        );
    });
    
    next();
};

export default httpLogger;