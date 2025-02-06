import { Chat, User, ChatUsers } from "../config/associations.js";
import { Op } from "sequelize";

export const createChat = async (req, res) => {
    try {
        const { name, is_group = false } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        const existingChat = await Chat.findOne({ where: { name } });
        if (existingChat) {
            return res.status(400).json({ message: "El chat ya existe" });
        }

        if (!is_group) {
            // Crear un chat privado
            const newChat = await Chat.create({ name, is_group, owner: req.uid });
            await ChatUsers.create({ chat_id: newChat.id, user_id: req.uid });

            return res.json({ message: "Chat creado exitosamente", chat: newChat });
        }

        // Crear un chat grupal
        let publicG = req.body.is_public || false; // Determinar si el chat es público

        const newChat = await Chat.create({ name, is_group, is_public: publicG,  owner: req.uid });
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
        const chat = await Chat.findOne({ where: { id: chat_id } });
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

export const inviteToChat = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const { user_id } = req.body;

        if (!chat_id || !user_id) {
            return res.status(400).json({ message: "Faltan campos por llenar" });
        }

        // Verificar si el chat es grupal
        const chat = await Chat.findOne({ where: { id: chat_id } });
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        if (!chat.is_group) {
            return res.status(400).json({ message: `El chat '${chat.name}' no es un chat grupal` });
        }

        const existingUser = await ChatUsers.findOne({ where: { chat_id, user_id } });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya está en el chat" });
        }

        await ChatUsers.create({ chat_id, user_id });
        res.json({ message: "Usuario invitado al chat" });
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
            await Chat.destroy({ where: { id: chat_id } });
        }

        res.json({ message: "Dejaste el chat" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error", error: error.message });
    }
};

export const getChats = async (req, res) => {
    try {
        // Obtener los chats a los que pertenece el usuario
        const userChats = await ChatUsers.findAll({
            where: { user_id: req.uid },
            attributes: ["chat_id"]
        });

        const userChatIds = userChats.map(chat => chat.chat_id);

        // Obtener todos los chats que sean grupales y públicos o en los que el usuario está presente
        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { id: userChatIds }, // Chats en los que el usuario pertenece
                    { is_group: true, is_public: true } // Chats grupales públicos
                ]
            },
            include: [
                {
                    model: User,
                    as: "ownerUser",
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        if (chats.length === 0) {
            return res.status(404).json({ message: "No hay chats" });
        }

        // Obtener la cantidad de usuarios en cada chat
        for (let i = 0; i < chats.length; i++) {
            const nUsers = await ChatUsers.count({ where: { chat_id: chats[i].id } });
            chats[i].dataValues.nUsers = nUsers;
        }

        res.json(chats);
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
            const user = await User.findOne({
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

        const chat = await Chat.findOne({ where: { id } });
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

        const chat = await Chat.findOne({ where: { id } });
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
