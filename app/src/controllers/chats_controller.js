import ChatModel from "../models/chats_model.js";

export const createChat = async (req, res) => {
    try {
        const { name } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatModel.findOne({ where: { name } });
        if (chat) {
            return res.status(400).json({ message: "El chat ya existe" });
        }

        await ChatModel.create({ name });
        res.json({ message: "Chat creado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const createGroupChat = async (req, res) => {
    try {
        const { name } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatModel.findOne({ where: { name } });
        if (chat) {
            return res.status(400).json({ message: "El chat ya existe" });
        }

        await ChatModel.create({ name, is_group: true });
        res.json({ message: "Chat grupal creado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const getChats = async (req, res) => {
    try {
        const chats = await ChatModel.findAll();
        if (chats.length === 0) {
            return res.status(404).json({ message: "No hay chats" });
        }

        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const getChat = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await ChatModel.findOne({ where: { id } });
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatModel.findOne({ where: { id } });
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        const chatFound = await ChatModel.findOne({ where: { name } });
        if (chatFound && chatFound.id !== chat.id) {
            return res.status(400).json({ message: "El chat ya existe" });
        }

        chat.name = name;
        await chat.save();
        res.json({ message: "Chat actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await ChatModel.findOne({ where: { id } });
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        await chat.destroy();
        res.json({ message: "Chat eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};