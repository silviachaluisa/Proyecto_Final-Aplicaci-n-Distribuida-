import { Router } from 'express';
import { register, login } from "../controllers/users_controller.js";
import { userRegisterValidator } from '../middlewares/users_validator.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/user/register', userRegisterValidator, register); // Ruta para registrar un usuario (POST /api/v1/user/register)
router.post('/user/login', login); // Ruta para iniciar sesión (POST /api/v1/user/login)

export default router;