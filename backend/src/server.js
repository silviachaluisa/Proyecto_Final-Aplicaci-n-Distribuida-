import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from 'http';
import { Server } from 'socket.io';

// Importar los controladores
import userRouter from './routers/users_routes.js';
import chatsRouter from './routers/chats_routes.js';
import messagesRouter from './routers/messages_routes.js';

dotenv.config();

// Inicializar express
const app = express();
const server = createServer(app); // Crear el servidor HTTP
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir conexiones desde cualquier origen
        methods: ["GET", "POST"]
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configuración de express
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // Para archivos CSS

// Configuración de middlewares
app.use(morgan('dev'));
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas a las vistas
app.get('/', (req, res) => {
    return res.json({message: 'API de chat', servidor: process.env.server_id});
});

app.get('/view/login', (req, res) => {
    res.render('login');
});

app.get('/view/register', (req, res) => {
    res.render('register');
});

app.get('/view/chats', (req, res) => {
    res.render('chats');
});

app.get('/view/profile', (req, res) => {
    res.render('profile');
});

// Rutas de usuarios
app.use('/api/v1', userRouter);
app.use('/api/v1', chatsRouter);
app.use('/api/v1', messagesRouter);

// Ruta para el error 404
app.use((req, res, next) => {
    res.status(404).json({message: 'Recurso no encontrado'});
});

// Configuración de socket.io
// Inicializar socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`📌 Usuario unido al chat ${chatId}`);
    });

    // Escuchar el evento 'chat message'
    socket.on("send_message", (message) => {
        console.log("📩 Mensaje recibido:", message);
        io.to(message.chatId).emit("receive_message", message.content); // Enviar mensaje al chat
    });

    // Escuchar el evento `create chat`
    socket.on('reload_chats', (chat) => {
        console.log('Chat creado:', chat);
        io.emit('reload chats', chat);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

// exportar app
export default server;