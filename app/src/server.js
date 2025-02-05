import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from "url";

// Importar los controladores
import userRouter from './routers/users_routes.js';
import chatsRouter from './routers/chats_routes.js';
import messagesRouter from './routers/messages_routes.js';

dotenv.config();

// Inicializar express
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configuración de express
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // Para archivos CSS

// Configuración de middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas a las vistas
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/view/register', (req, res) => {
    res.render('register');
});

app.get('/view/chats', (req, res) => {
    res.render('chats');
});

// Rutas de usuarios
app.use('/api/v1', userRouter);
app.use('/api/v1', chatsRouter);
app.use('/api/v1', messagesRouter);

// Ruta para el error 404
app.use((req, res, next) => {
    res.status(404).json({message: 'Recurso no encontrado'});
});

// exportar app
export default app;