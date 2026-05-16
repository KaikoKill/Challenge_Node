import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import requestApiPago from '../api/call_api';
import prisma from '../database/db';

interface CreatePaymentBody {
    usuario_fk: number;
    tarjeta_fk: number;
    monto: number;
    descripcion?: string;
}

export const crearPago = async (req: Request<unknown, unknown, CreatePaymentBody>, res: Response) => {
    const { usuario_fk, tarjeta_fk, monto, descripcion } = req.body;
    try {
        const apiResponse = await requestApiPago(monto);
        if (!apiResponse.aprobado) {
            return res.status(402).json({ error: apiResponse.mensaje || 'Pago rechazado' });
        }

        if (Number(req.user?.sub) !== usuario_fk) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const user = await prisma.usuario.findUnique({ where: { id: usuario_fk } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const card = await prisma.tarjeta.findUnique({ where: { id: tarjeta_fk } });
        if (!card || card.usuario_fk !== usuario_fk) {
            return res.status(400).json({ error: 'Tarjeta invalida para el usuario' });
        }

        const payment = await prisma.pago.create({
            data: {
                usuario_fk,
                tarjeta_fk,
                monto: new Prisma.Decimal(monto),
                descripcion
            }
        });

        return res.status(201).json({
            ...payment,
            procesador: apiResponse,
            message: apiResponse.mensaje
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al procesar el pago' });
    }
};

export const historialPagos = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    const usuario_id = Number(usuarioId);
    try {
        if (Number(req.user?.sub) !== usuario_id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const hasCard = await prisma.tarjeta.findFirst({
            where: { usuario_fk: usuario_id }
        });
        if (!hasCard) {
            return res.status(404).json({ error: 'Usuario no posee una tarjeta' });
        }

        const payments = await prisma.pago.findMany({
            where: { usuario_fk: usuario_id },
            include: { tarjeta: true },
            orderBy: { f_pago: 'desc' }
        });

        const response = payments.map((payment) => ({
            monto: payment.monto,
            descripcion: payment.descripcion,
            fecha_pago: payment.f_pago,
            tarjeta: payment.tarjeta
                ? {
                    numero: payment.tarjeta.numero,
                    nombre: payment.tarjeta.nombre,
                    f_fin: payment.tarjeta.f_fin
                }
                : null
        }));

        return res.json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el historial' });
    }
};
