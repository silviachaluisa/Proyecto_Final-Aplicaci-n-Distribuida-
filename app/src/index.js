import app from "./server.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
console.log(process.env.MySQL_HOST);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${process.env.URL_BACKEND}`);
    console.log(`Acceso a las vistas en ${process.env.URL_VIEWS}`);
});