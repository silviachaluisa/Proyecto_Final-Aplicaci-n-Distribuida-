import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Importar los controladores
import userRouter from './routers/users_routes.js';

dotenv.config();

// Inicializar express
const app = express();

// Configuración de middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
    res.json({message: '¡Hola mundo!'});
});

// Rutas de usuarios
app.use('/api/v1', userRouter);

// Ruta para el error 404
app.use((req, res, next) => {
    res.status(404).json({message: 'Recurso no encontrado'});
});

// exportar app
export default app;