import User from "../models/users_model.js";
import Chat from "../models/chats_model.js";
import ChatUsers from "../models/chat_users_model.js";
import Messages from "../models/messages_model.js";

// Relación: Un usuario puede ser dueño de muchos chats
User.hasMany(Chat, { foreignKey: "owner", as: "ownedChats" });
Chat.belongsTo(User, { foreignKey: "owner", as: "ownerUser" });

// Relación: Un chat puede tener muchos usuarios (Muchos a Muchos)
Chat.belongsToMany(User, { through: ChatUsers, foreignKey: "chat_id", as: "users" });
User.belongsToMany(Chat, { through: ChatUsers, foreignKey: "user_id", as: "chats" });

// Relación: Un usuario puede enviar muchos mensajes
User.hasMany(Messages, { foreignKey: "user_id", as: "messages" });
Messages.belongsTo(User, { foreignKey: "user_id", as: "sender" });

// Relación: Un chat puede contener muchos mensajes
Chat.hasMany(Messages, { foreignKey: "chat_id", as: "messages" });
Messages.belongsTo(Chat, { foreignKey: "chat_id", as: "chat" });

export { User, Chat, ChatUsers, Messages };
