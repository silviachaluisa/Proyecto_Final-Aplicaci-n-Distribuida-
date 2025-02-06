import { Router } from "express";
import { getChats, getChatUsers, createChat, joinChat, inviteToChat, updateChat, leaveChat, deleteChat } from "../controllers/chats_controller.js";
import { chatValidator } from "../middlewares/chats_validator.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.route("/create-chat")
    .post(auth, chatValidator, createChat); // Ruta para crear un chat (POST /api/v1/chat)

router.route("/join-chat/:chat_id")
    .post(auth, joinChat); // Ruta para unirse a un chat (POST /api/v1/chat/join)

router.route("/invite-chat/:chat_id")
    .post(auth, inviteToChat); // Ruta para invitar a un chat (POST /api/v1/chat/invite)

router.route("/leave-chat")
    .post(auth, leaveChat); // Ruta para salir de un chat (POST /api/v1/chat/leave)

router.route("/chats")
    .get(auth, getChats); // Ruta para obtener todos los chats (GET /api/v1/chats)

router.route("/chat-users/:chat_id")
    .get(auth, getChatUsers); // Ruta para obtener todos los usuarios de un chat por su ID (GET /api/v1/chat-users/:id)

router.route("/chat/:id")
    .put(auth, updateChat) // Ruta para actualizar un chat por su ID (PUT /api/v1/chat/:id)
    .delete(auth, deleteChat); // Ruta para eliminar un chat por su ID (DELETE /api/v1/chat/:id)

export default router;