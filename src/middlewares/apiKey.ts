import type { NextFunction, Request, Response } from 'express';

const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
    const requiredKey = process.env.API_KEY;
    if (!requiredKey) {
        return next();
    }

    const providedKey = req.header('x-api-key');
    if (providedKey !== requiredKey) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    return next();
};

export default apiKeyAuth;
