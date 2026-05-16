import type { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'dev_secret';
        const payload = jwt.verify(token, secret);
        if (typeof payload === 'string') {
            return res.status(401).json({ error: 'Token invalido' });
        }
        req.user = payload as JwtPayload;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalido' });
    }
};

export default auth;
