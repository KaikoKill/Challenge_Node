export interface PaymentProcessorResponse {
    aprobado: boolean;
    mensaje: string;
}

const requestApiPago = async (monto: number): Promise<PaymentProcessorResponse> => {
    try {
        const url = process.env.API_PAGO_URL || 'http://localhost:8000/process';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ monto })
        });
        if (!response.ok) {
            throw new Error('Error al acceder a la api');
        }
        return await response.json() as PaymentProcessorResponse;
    } catch (error) {
        console.error(error);
        throw new Error('Error al procesar el pago');
    }
};

export default requestApiPago;
