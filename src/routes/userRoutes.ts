import { Router } from 'express';
import { crearUsuario } from '../controllers/userController';
import validate from '../middlewares/validate';
import { createUserSchema } from '../validators';

const router = Router();

router.post('/', validate(createUserSchema), crearUsuario);

export default router;
