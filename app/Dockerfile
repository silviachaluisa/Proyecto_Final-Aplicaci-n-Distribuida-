# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo package.json y package-lock.json primero para aprovechar caché
COPY package*.json ./

# Instala dependencias dentro del contenedor sin copiar node_modules del host
RUN npm install --only=production

# Copia el resto del código después de instalar dependencias
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "src/index.js"]
