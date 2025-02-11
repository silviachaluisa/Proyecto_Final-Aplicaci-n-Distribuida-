import React from 'react'

// Importación de contextos
import { useAuth } from '../context/AuthProvider';

const ChatCard = ({ chatMessages }) => {
    const { user } = useAuth();

    return (
        <>
            {
                chatMessages.sender.id === user.id ? (
                    <div className="w-full flex flex-col items-end justify-start gap-4 p-2">
                        <div className="bg-blue-500 dark:bg-blue-700 p-3 rounded-tr-lg rounded-tl-lg rounded-bl-lg text-white">
                            <p className="text-white font-semibold">{chatMessages.sender.name}</p>
                            <p className="text-white">{chatMessages.content}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-start justify-start gap-4 p-2">
                        <div className="bg-gray-300 dark:bg-gray-700 p-3 rounded-tr-lg rounded-tl-lg rounded-br-lg text-gray-800 dark:text-white">
                            <p className="text-gray-800 dark:text-white font-semibold">{chatMessages.sender.name}</p>
                            <p className="text-gray-600 dark:text-gray-300">{chatMessages.content}</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ChatCard
