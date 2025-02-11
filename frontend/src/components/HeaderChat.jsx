import React from 'react'
import { FaTimes } from "react-icons/fa"
import { MdGroupAdd } from "react-icons/md";

// Importación de contextos
import { useChat } from '../context/ChatProvider';

const HeaderChat = () => {
    const { selectedChat:chatInfo, setSelectedChat } = useChat();

    const handleCloseChat = () => {
        setSelectedChat(null);
    };

    return (
        <div className='flex items-center justify-between w-full p-4 bg-gray-500 dark:bg-gray-700 rounded-t-lg'>
            <p className="text-white font-semibold">${chatInfo.name}</p>
            <div className="flex items-center justify-between gap-4">
                {chatInfo.is_group && (
                    <button className="bg-blue-500 dark:bg-blue-700 text-white rounded-lg p-2 cursor-pointer">
                        <span>
                            <MdGroupAdd className="text-xl" />
                        </span>
                    </button>
                    )
                }
                
                <button className="bg-red-500 dark:bg-red-700 text-white rounded-lg p-2 cursor-pointer">
                    <span>
                        <FaTimes className="text-xl" />
                    </span>
                </button>
            </div>
        </div>
    )
}

export default HeaderChat
