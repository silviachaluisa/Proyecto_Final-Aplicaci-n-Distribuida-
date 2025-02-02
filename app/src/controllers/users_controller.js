import UserModel from "../models/users_model.js";
import bcrypt from "bcrypt";
import generarJWT from '../helpers/JWT.js';
import { UAParser } from "ua-parser-js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const user = await UserModel.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const {
            password : passwordUser,
            id,
            createdAt,
            ...infoUser
        } = newUser.dataValues;

        res.json({ message: "Usuario registrado", user: infoUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = generarJWT({ id: user.id });
        res.json({ message: "Bienvenido", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error" });
    }
};