import React, { useEffect, useRef } from 'react'
import { useSocket } from "../context/useSocket";

// Importación de contextos
import { useChat } from '../context/ChatProvider';

// Importación de componentes
import HeaderChat from '../components/HeaderChat';
import ChatCard from '../components/ChatCard';
import FooterChat from '../components/FooterChat';

const ChatScreen = () => {
    const { selectedChat, getChatMessages, messages , setMessages, loadingMessages} = useChat();
    const messagesEndRef = useRef(null);
    const socket = useSocket();

    useEffect(() => {
        if (!selectedChat) {
            window.location.href = '/chats';
            return;
        }

        getChatMessages(selectedChat.id);
    }, [selectedChat]);

    // Hacer scroll después de que los mensajes hayan cambiado
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // Se activa solo cuando los mensajes cambian

    // 📡 Escuchar nuevos mensajes en tiempo real
    useEffect(() => {
        if (!socket || !selectedChat) return;

        socket.emit("join_chat", selectedChat.id); // Unirse al chat específico

        socket.on("receive_message", (newMessage) => {
            console.log("📩 Nuevo mensaje recibido:", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Agregar el mensaje al estado
        });

        return () => {
            socket.off("receive_message"); // Limpiar evento al desmontar
        };
    }, [socket, selectedChat]);

    return (
        <>
            <HeaderChat />

            <div className='flex flex-col items-start justify-start w-full h-full p-4 gap-4 overflow-y-auto bg-gray-300 dark:bg-gray-900'>
                {
                    loadingMessages ? (
                        <div className='w-full flex items-center justify-center gap-4'>
                            <h1 className='text-2xl font-semibold text-gray-800 dark:text-white italic'>Cargando mensajes...</h1>
                        </div>
                    ) : (
                        messages.length > 0 ? (
                            messages.map((message) => (
                                <ChatCard key={message.id} chatMessages={message} />
                            ))
                        ) : (
                            <div className='w-full flex items-center justify-center gap-4'>
                                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white italic'>No hay mensajes</h1>
                            </div>
                        )
                    )
                }
                <div ref={messagesEndRef} />
            </div>

            <FooterChat />
        </>
    )
}

export default ChatScreen
