import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../database.js';

// Crear el modelo de la tabla 'chat_users'
const ChatUsers = sequelize.define('chats_users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'chats_users'
});

export default ChatUsers;