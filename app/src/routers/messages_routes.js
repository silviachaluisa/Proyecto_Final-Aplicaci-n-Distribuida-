import { Router } from 'express';
import { getMessages, sendMessage, editMessage, readMessage, deleteMessage } from '../controllers/messages_controller.js';
import { messageValidator } from '../middlewares/messages_validator.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.route('/messages/:chat_id')
    .get(auth, getMessages); // Ruta para obtener todos los mensajes de un chat (GET /api/v1/messages/:chat_id)

router.route('/send-message/:chat_id')
    .post(auth, messageValidator, sendMessage); // Ruta para enviar un mensaje a un chat (POST /api/v1/send-message)

router.route('/edit-message/:message_id')
    .put(auth, editMessage); // Ruta para editar un mensaje (PUT /api/v1/edit-message)

router.route('/read-message')
    .put(auth, readMessage); // Ruta para marcar un mensaje como leído (PUT /api/v1/read-message)

router.route('/delete-message/:message_id')
    .delete(auth, deleteMessage); // Ruta para eliminar un mensaje (DELETE /api/v1/delete-message)

export default router;