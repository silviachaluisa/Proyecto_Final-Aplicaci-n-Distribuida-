import React, { useEffect } from 'react'

// Importación de contextos
import { useChat } from '../context/ChatProvider';

// Importación de componentes
import HeaderChat from '../components/HeaderChat';
import ChatCard from '../components/ChatCard';
import FooterChat from '../components/FooterChat';

const ChatScreen = () => {
    const { selectedChat, getChatMessages, messages } = useChat();

    useEffect(() => {
        if (!selectedChat) {
            window.location.href = '/chats';
        }

        getChatMessages(selectedChat.id);
    }, []);

    return (
        <>
            <HeaderChat />

            <div className='flex flex-col items-start justify-start w-full h-full p-4 gap-4 overflow-y-auto bg-gray-300 dark:bg-gray-900'>
                {
                    messages.kength > 0 ? (messages.map((message) => (
                        <ChatCard key={message.id} chatMessages={message} />
                    ))) : (
                        <div className='w-full flex items-center justify-center gap-4'>
                            <h1 className='text-2xl font-semibold text-gray-800 dark:text-white italic'>No hay mensajes</h1>
                        </div>
                    )
                }
            </div>

            <FooterChat />
        </>
    )
}

export default ChatScreen
