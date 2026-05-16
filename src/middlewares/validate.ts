import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

type RequestSource = 'body' | 'params' | 'query';

const validate = (schema: ZodTypeAny, source: RequestSource = 'body') => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        return res.status(400).json({
            error: 'Datos invalidos',
            details: result.error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        });
    }
    (req as unknown as Record<RequestSource, unknown>)[source] = result.data;
    return next();
};

export default validate;
