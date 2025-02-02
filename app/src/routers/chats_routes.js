import { Router } from "express";
import { getChats, getChat, createChat, createGroupChat, updateChat, deleteChat } from "../controllers/chats_controller.js";
import { chatValidator } from "../middlewares/chats_validator.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.route("/create-chat")
    .post(auth, chatValidator, createChat); // Ruta para crear un chat (POST /api/v1/chat)
    
router.route("/create-group-chat")
    .post(auth, chatValidator, createGroupChat); // Ruta para crear un chat grupal (POST /api/v1/group-chat)

router.route("/chats")
    .get(auth, getChats); // Ruta para obtener todos los chats (GET /api/v1/chat)

router.route("/chat/:id")
    .get(auth, getChat) // Ruta para obtener un chat por su ID (GET /api/v1/chat/:id)
    .put(auth, chatValidator, updateChat) // Ruta para actualizar un chat por su ID (PUT /api/v1/chat/:id)
    .delete(auth, deleteChat); // Ruta para eliminar un chat por su ID (DELETE /api/v1/chat/:id)

export default router;