import React, { useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoReload } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importación de contextos
import { useAuth } from '../context/AuthProvider';
import { useChat } from '../context/ChatProvider';

// Importacion de componentes
import HeaderNav from '../components/HeaderNav';
import Notification from '../components/Notification';
import ChargeChatBanner from '../components/ChargeChatBanner';
import ChatBanner from '../components/ChatBanner';
import ChatWelcome from '../components/ChatWelcome';
import ChatScreen from '../components/ChatScreen';

const ChatsPage = () => {
    const { user, notification } = useAuth();
    const {
        chats,
        notification: chatNotification,
        getChats,
        createChat,
        selectedChat,
        loading
    } = useChat();

    const handleRefreshChats = () => {
        getChats();
    };

    useEffect(() => {
        getChats();
    }, []);

    return (
        <div className='bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-screen'>
            <HeaderNav />
            { notification.content && <Notification type={ notification.type } content={ notification.content } /> }
            { chatNotification.content && <Notification type={ chatNotification.type } content={ chatNotification.content } /> }
            <div className="w-full flex flex-col md:flex-row gap-4 max-w-7xl mt-16 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-screen md:h-5/6">
                <div className="w-full md:w-4/12 lg:w-4/12 flex flex-col items-start justify-start border-r border-gray-300 dark:border-gray-700 p-4 overflow-y-auto">
                    <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
                        Lista de <span className="text-blue-500 uppercase">chats</span>
                    </h1>
                    
                    <div className="relative w-full flex items-center justify-center">
                        <input type="text" placeholder="Buscar chat" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <FaSearch className="absolute right-5 top-4 text-gray-500 dark:text-gray-300" />
                    </div>
                    
                    <div className="flex flex-row gap-4 mt-4 justify-center items-center">
                        <div className="flex items-center justify-center bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400 w-10 h-10">
                            <FaPlus className="text-xl" data-tooltip-id="addChat" data-tooltip-content="Crear un nuevo chat" />
                        </div>
                        <div className="flex items-center justify-center bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400 w-10 h-10" onClick={handleRefreshChats}>
                            <IoReload className="text-xl font-bold" data-tooltip-id="reloadChats" data-tooltip-content="Recargar los chats"/>
                        </div>
                        <ReactTooltip id="addChat" place='bottom' />
                        <ReactTooltip id="reloadChats" place='bottom' />
                    </div>
                    <div id="chats-container" className="flex flex-col gap-4 mt-4 w-full justify-center items-center">
                        {
                            (loading ) ? (
                                [...Array(5)].map((_, i) => (
                                    <ChargeChatBanner key={i} />
                                ))
                            ) : (
                                chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <ChatBanner key={chat.id} chatInfo={chat} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 font-semibold italic">No hay chats disponibles.</p>
                                )
                            )
                        }
                    </div>
                </div>
                <div className='w-full md:w-8/12 lg:w-9/12 flex flex-col items-center justify-center p-4 h-full'>
                    {
                        selectedChat ? (
                            <ChatScreen />
                        ) : (
                            <ChatWelcome />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatsPage
