import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de sequelize e indicar credenciales del servidor MySQL
const sequelize = new Sequelize(
    process.env.MySQL_DATABASE,
    process.env.MySQL_USER,
    process.env.MySQL_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.MySQL_HOST || 'localhost',
        port: process.env.MySQL_PORT || 3306
    }
);

// Probar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log("Conexión establecida a la base de datos!!!");
  })
  .catch(err => {
    console.error("Error de conexión a la base de datos: ", err);
  });

// Exportar sequelize
export default sequelize;