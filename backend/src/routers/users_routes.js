import { Router } from 'express';
import { register, login, getUser, updateUser, deleteUser } from "../controllers/users_controller.js";
import { userRegisterValidator } from '../middlewares/users_validator.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/user/register', userRegisterValidator, register); // Ruta para registrar un usuario (POST /api/v1/user/register)
router.post('/user/login', login); // Ruta para iniciar sesión (POST /api/v1/user/login)

router.route('/user')
    .get(auth, getUser) // Ruta para obtener la información del usuario autenticado (GET /api/v1/user)
    .put(auth, updateUser) // Ruta para actualizar la información del usuario autenticado (PUT /api/v1/user)
    .delete(auth, deleteUser); // Ruta para eliminar la cuenta del usuario autenticado (DELETE /api/v1/user)

export default router;