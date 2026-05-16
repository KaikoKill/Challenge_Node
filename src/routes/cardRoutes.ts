import { Router } from 'express';
import { registrarTarjeta } from '../controllers/cardController';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { createCardSchema } from '../validators';

const router = Router();

router.use(auth);
router.post('/', validate(createCardSchema), registrarTarjeta);

export default router;
