import { Chat, User, ChatUsers, Messages } from "../config/associations.js";

export const getMessages = async (req, res) => {
    try {
        const { chat_id } = req.params;

        if (!chat_id) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatUsers.findOne({ 
            where: { chat_id, user_id: req.uid }
        });
        if (!chat) {
            return res.status(400).json({ message: "No estás en ese chat" });
        }

        const messages = await Messages.findAll({
            where: { chat_id },
            include: [{ model: User, as: "sender", attributes: ["id", "name"] }],
        });

        // Marcar los mensajes como leídos por el usuario actual
        for (const message of messages) {
            const readby = JSON.parse(message.readby);
            if (!readby.includes(req.uid)) {
                readby.push(req.uid);
                await message.update({ readby: JSON.stringify(readby) });
            }
        }

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const { content } = req.body;

        if (!chat_id || !content) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatUsers.findOne({ where: { chat_id, user_id: req.uid } });
        if (!chat) {
            return res.status(400).json({ message: "No estás en ese chat" });
        }

        await Messages.create({ chat_id, user_id: req.uid, content, readby: JSON.stringify([req.uid]) });
        res.json({ message: "Mensaje enviado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { message_id } = req.params;
        const { content } = req.body;

        if (!message_id || !content) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const message = await Messages.findOne({ where: { id: message_id } });
        if (!message) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }

        if (message.user_id !== req.uid) {
            return res.status(403).json({ message: "No tienes permiso para editar este mensaje" });
        }

        await message.update({ content });
        res.json({ message: "Mensaje editado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const readMessage = async (req, res) => {
    try {
        const { message_id } = req.body;

        if (!message_id) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const message = await Messages.findOne({ where: { id: message_id } });
        if (!message) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }

        const readby = JSON.parse(message.readby);
        if (readby.includes(req.uid)) {
            return res.status(400).json({ message: "Ya leíste este mensaje" });
        }

        readby.push(req.uid);
        await message.update({ readby: JSON.stringify(readby) });
        res.json({ message: "Mensaje leído" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { message_id } = req.params;

        if (!message_id) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const message = await Messages.findOne({ where: { id: message_id } });
        if (!message) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }

        if (message.user_id !== req.uid) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este mensaje" });
        }

        await message.destroy();
        res.json({ message: "Mensaje eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};
