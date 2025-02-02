import ChatUsers from "../models/chat_users_model.js";

export const joinChat = async (req, res) => {
    try {
        const { chat_id, user_id } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatUsers.findOne({ where: { chat_id, user_id } });
        if (chat) {
            return res.status(400).json({ message: "Ya estás en el chat" });
        }

        await ChatUsers.create({ chat_id, user_id });
        res.json({ message: "Te uniste al chat" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const leaveChat = async (req, res) => {
    try {
        const { chat_id, user_id } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatUsers.findOne({ where: { chat_id, user_id } });
        if (!chat) {
            return res.status(400).json({ message: "No estás en el chat" });
        }

        await ChatUsers.destroy({ where: { chat_id, user_id } });
        res.json({ message: "Dejaste el chat" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const getChatUsers = async (req, res) => {
    try {
        const { chat_id } = req.params;

        const users = await ChatUsers.findAll({ where: { chat_id } });
        if (users.length === 0) {
            return res.status(404).json({ message: "No hay usuarios en el chat" });
        }

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};