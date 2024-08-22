import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

let currentUser: jwt.JwtPayload | string | undefined;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403); 
        currentUser = user;
        next();
    });
};

export const getCurrentUser = () => currentUser;
