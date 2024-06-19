import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Bearer header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        // Cast the decoded payload to JwtPayload type
        const payload = decoded as {
            user_id: number 
        };
        // Attach the decoded payload to the request for further use
        req['user'] = {
            id: payload.user_id
        };
        next();
    });
};

export default authenticate;
