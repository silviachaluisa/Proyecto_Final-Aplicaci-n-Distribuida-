-- Tabla de usuarios
CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'ID auto incremental de cada usuario',
  `name` VARCHAR(50) NOT NULL COMMENT 'Nombre completo del usuario',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico único del usuario',
  `password` VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada del usuario',
  `createdAt` DATETIME NOT NULL COMMENT 'Fecha y hora en que se creó el registro del usuario',
  PRIMARY KEY(`id`)
) COMMENT = 'Tabla que almacena la información de los usuarios';

-- Tabla de chats o conversaciones
CREATE TABLE `chats` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'ID auto incremental del chat o conversación',
  `is_group` BOOLEAN DEFAULT false COMMENT 'Determina si el chat es grupal (true) o individual (false)',
  `name` VARCHAR(30) NOT NULL UNIQUE COMMENT 'Nombre del chat; en chats grupales es obligatorio y único',
  `owner` INTEGER NOT NULL COMMENT 'ID del usuario que creó el chat (clave foránea a users)',
  `createdAt` DATETIME NOT NULL COMMENT 'Fecha y hora en que se creó el chat',
  PRIMARY KEY(`id`)
) COMMENT = 'Tabla que almacena los chats o conversaciones';

-- Tabla intermedia para relacionar chats y usuarios
CREATE TABLE `chats_users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'ID auto incremental de la relación chat-usuario',
  `chat_id` INTEGER NOT NULL COMMENT 'ID del chat asociado (clave foránea a chats)',
  `user_id` INTEGER NOT NULL COMMENT 'ID del usuario asociado (clave foránea a users)',
  `joinedAt` DATETIME NOT NULL COMMENT 'Fecha y hora en que el usuario se unió al chat',
  PRIMARY KEY(`id`)
) COMMENT = 'Tabla que relaciona usuarios con chats';

-- Tabla de mensajes
CREATE TABLE `messages` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'ID auto incremental del mensaje',
  `chat_id` INTEGER NOT NULL COMMENT 'ID del chat al que pertenece el mensaje (clave foránea a chats)',
  `user_id` INTEGER NOT NULL COMMENT 'ID del usuario que envió el mensaje (clave foránea a users)',
  `content` TEXT NOT NULL COMMENT 'Contenido del mensaje',
  `createdAt` DATETIME NOT NULL COMMENT 'Fecha y hora en que se envió el mensaje',
  `readby` TEXT NOT NULL COMMENT 'Lista (en formato texto) de usuarios que han leído el mensaje',
  PRIMARY KEY(`id`)
) COMMENT = 'Tabla que almacena los mensajes de los chats';

-- Claves foráneas para la tabla chats_users
ALTER TABLE `chats_users`
ADD FOREIGN KEY(`chat_id`) REFERENCES `chats`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `chats_users`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

-- Claves foráneas para la tabla messages
ALTER TABLE `messages`
ADD FOREIGN KEY(`chat_id`) REFERENCES `chats`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `messages`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
