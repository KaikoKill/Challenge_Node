import type { Request, Response } from 'express';
import prisma from '../database/db';

interface CreateCardBody {
    usuario_fk: number;
    numero: string;
    nombre: string;
    f_fin: string;
}

export const registrarTarjeta = async (req: Request<unknown, unknown, CreateCardBody>, res: Response) => {
    const { usuario_fk, numero, nombre, f_fin } = req.body;
    try {
        if (Number(req.user?.sub) !== usuario_fk) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const user = await prisma.usuario.findUnique({ where: { id: usuario_fk } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const card = await prisma.tarjeta.create({
            data: {
                usuario_fk,
                nombre,
                numero,
                f_fin
            }
        });
        const last4 = numero.slice(-4);

        return res.status(201).json({
            ...card,
            titular: card.nombre,
            numero: `**** **** **** ${last4}`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al registrar la tarjeta' });
    }
};
