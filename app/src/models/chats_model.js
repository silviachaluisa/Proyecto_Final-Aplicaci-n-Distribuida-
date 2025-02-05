import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../database.js';

// Crear el modelo de la tabla 'chats'
const Chat = sequelize.define('chats', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    is_group: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'chats'
});

export default Chat;