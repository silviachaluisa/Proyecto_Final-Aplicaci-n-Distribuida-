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
        await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        res.json({ message: "Usuario registrado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
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

        const token = generarJWT(user.id);
        res.json({ message: "Bienvenido", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.uid, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const user = await UserModel.findByPk(req.uid);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userFound = await UserModel.findOne({ where: { email } });
        if (userFound && userFound.id !== user.id) {
            return res.status(400).json({ message: "El correo ya está en uso" });
        }

        user.name = name;
        user.email = email;
        await user.save();
        res.json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.uid);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.destroy();
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};