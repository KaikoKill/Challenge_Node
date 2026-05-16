import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../database/db';

interface LoginBody {
    email: string;
    password: string;
}

export const login = async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.usuario.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no existe' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Contrasena incorrecta' });
        }

        const secret = process.env.JWT_SECRET || 'dev_secret';
        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
        const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
        const token = jwt.sign({ sub: user.id, email: user.email }, secret, options);

        return res.json({ token, expires_in: expiresIn });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al iniciar sesion' });
    }
};
