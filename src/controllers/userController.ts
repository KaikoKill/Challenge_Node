import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import prisma from '../database/db';

interface CreateUserBody {
    nombre: string;
    email: string;
    password: string;
}

export const crearUsuario = async (req: Request<unknown, unknown, CreateUserBody>, res: Response) => {
    const { nombre, email, password } = req.body;
    try {
        const existing = await prisma.usuario.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'El email ya esta registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.usuario.create({ data: { nombre, email, passwordHash } });

        return res.status(201).json({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            creado_in: user.creado_in
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el usuario' });
    }
};
