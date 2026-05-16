from fastapi import FastAPI
from shemas import PaymentRequest, PaymentResponse
import random

app = FastAPI(title="Payment Processor", version="1.0.0")

@app.post("/process", response_model=PaymentResponse)
def process_payment(payload: PaymentRequest):
    aprobado = random.random() < 0.8
    mensaje = "Pago aprobado" if aprobado else "Pago rechazado"
    return PaymentResponse(aprobado=aprobado, mensaje=mensaje)
