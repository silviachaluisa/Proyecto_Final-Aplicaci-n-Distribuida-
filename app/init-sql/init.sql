-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `chatapp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Crear el usuario admin con privilegios completos sobre todas las bases de datos
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
-- Dar privilegios completos sobre todas las bases de datos
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
-- Asegurarse de que los privilegios se apliquen correctamente
FLUSH PRIVILEGES;

-- Crear el usuario de replicación
CREATE USER 'replica'@'%' IDENTIFIED BY 'replica';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'%';
FLUSH PRIVILEGES;
-- Asegurarse de que los privilegios se apliquen correctamente
FLUSH PRIVILEGES;


-- Crear el usuario de replicación
CREATE USER 'replica'@'%' IDENTIFIED BY 'replica';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'%';
FLUSH PRIVILEGES;

