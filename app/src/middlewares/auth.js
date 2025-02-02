import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/users_model.js';

dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await UserModel.findByPk(decoded.id);

        if (!usuario) {
            throw new Error("Usuario no autenticado, por favor inicie sesión");
        }

        req.uid = usuario.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Error en la autenticacion', error: error.message });
    }
};

export default auth;