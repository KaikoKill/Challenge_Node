import { z } from 'zod';

const toInt = z.preprocess((value: unknown) => {
    if (typeof value === 'string' && value.trim() !== '') {
        return Number(value);
    }
    return value;
}, z.number().int().positive());

const toImport = z.preprocess((value: unknown) => {
    if (typeof value === 'string' && value.trim() !== '') {
        return Number(value);
    }
    return value;
}, z.number().positive());

const createUserSchema = z.object({
    nombre: z.string().min(1).max(100),
    email: z.string().email().max(100),
    password: z.string().min(8).max(100)
});

const createCardSchema = z.object({
    usuario_fk: toInt,
    numero: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/),
    nombre: z.string().min(1).max(100),
    f_fin: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/)
});

const createPaymentSchema = z.object({
    usuario_fk: toInt,
    tarjeta_fk: toInt,
    monto: toImport,
    descripcion: z.string().max(500).optional()
});

const userIdParamSchema = z.object({
    usuarioId: toInt
});

const loginSchema = z.object({
    email: z.string().email().max(100),
    password: z.string().min(8).max(100)
});

export {
    createUserSchema,
    createCardSchema,
    createPaymentSchema,
    userIdParamSchema,
    loginSchema
};
