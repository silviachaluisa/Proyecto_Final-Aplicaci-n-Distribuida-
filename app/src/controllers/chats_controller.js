import ChatModel from "../models/chats_model.js";
import ChatUsers from "../models/chat_users_model.js";
import UserModel from "../models/users_model.js";

export const createChat = async (req, res) => {
    try {
        const { name, is_group = false } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const existingChat = await ChatModel.findOne({ where: { name } });
        if (existingChat) {
            return res.status(400).json({ message: "El chat ya existe" });
        }

        const newChat = await ChatModel.create({ name, is_group,  owner: req.uid });
        await ChatUsers.create({ chat_id: newChat.id, user_id: req.uid });

        res.json({ message: "Chat creado y unido exitosamente", chat: newChat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const joinChat = async (req, res) => {
    try {
        const { chat_id } = req.params;

        if (!chat_id) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        // Verificar si el chat es grupal
        const chat = await ChatModel.findOne({ where: { id: chat_id } });
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        if (!chat.is_group) {
            return res.status(400).json({ message: `El chat '${chat.name}' no es un chat grupal` });
        }

        const existingUser = await ChatUsers.findOne({ where: { chat_id, user_id: req.uid } });
        if (existingUser) {
            return res.status(400).json({ message: "Ya estás en ese chat" });
        }

        await ChatUsers.create({ chat_id, user_id: req.uid });
        res.json({ message: `Te uniste al chat '${chat.name}'` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const leaveChat = async (req, res) => {
    try {
        const { chat_id } = req.body;

        if (!chat_id) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chatUser = await ChatUsers.findOne({ where: { chat_id, user_id: req.uid } });
        if (!chatUser) {
            return res.status(400).json({ message: "No estás en el chat" });
        }

        await chatUser.destroy();

        // Verificar si quedan usuarios en el chat
        const nUsers = await ChatUsers.count({ where: { chat_id } });

        // Si no quedan usuarios, eliminar el chat
        if (nUsers === 0) {
            await ChatModel.destroy({ where: { id: chat_id } });
        }

        res.json({ message: "Dejaste el chat" });
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

        // Listar los chats a los que pertenece el usuario
        const userChats = await ChatUsers.findAll({ where: { user_id: req.uid } });
        const userChatsIds = userChats.map(chat => chat.chat_id);

        // Filtrar los chats a los que pertenece el usuario
        const chatList = chats.filter(chat => userChatsIds.includes(chat.id));

        res.json(chatList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const getChatUsers = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const listUsers = []; // Lista de usuarios en el chat

        const users = await ChatUsers.findAll({ where: { chat_id } });
        if (users.length === 0) {
            return res.status(404).json({ message: "No hay usuarios en el chat" });
        }

        // Obtener la informacion del ususario (JOIN)
        for (let i = 0; i < users.length; i++) {
            const user = await UserModel.findOne({
                where: { id: users[i].user_id },
                attributes: { exclude: ['password'] }
            });
            listUsers.push(user);
        }

        res.json(listUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const chat = await ChatModel.findOne({ where: { id } });
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        chat.name = name;
        await chat.save();
        res.json({ message: "Chat actualizado exitosamente", chat });
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

        // Eliminar los usuarios del chat
        const users = await ChatUsers.findAll({ where: { chat_id: id } });
        for (let i = 0; i < users.length; i++) {
            await users[i].destroy();
        }

        await ChatUsers.destroy({ where: { chat_id: id } });
        await chat.destroy();
        res.json({ message: "Chat eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};
