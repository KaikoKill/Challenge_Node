from pydantic import BaseModel, Field

class PaymentRequest(BaseModel):
    monto: float = Field(..., gt=0)


class PaymentResponse(BaseModel):
    aprobado: bool
    mensaje: str