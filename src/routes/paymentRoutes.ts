import { Router } from 'express';
import { crearPago, historialPagos } from '../controllers/paymentController';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { createPaymentSchema, userIdParamSchema } from '../validators';

const router = Router();

router.use(auth);
router.post('/', validate(createPaymentSchema), crearPago);
router.get('/usuario/:usuarioId', validate(userIdParamSchema, 'params'), historialPagos);

export default router;
