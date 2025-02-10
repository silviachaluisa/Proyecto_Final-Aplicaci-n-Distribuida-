import React from "react";
import { IoIosChatbubbles } from "react-icons/io";

const ChatWelcome = () =>  {
    return (
    <div className="w-full md:w-8/12 lg:w-9/12 flex flex-col items-center justify-center p-4 h-full">
        <div className="flex flex-col items-center justify-center text-center max-w-md">
            <div className="flex items-center justify-center bg-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-400 w-16 h-16">
                <IoIosChatbubbles className="text-3xl text-black" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mt-4">
                Accede a un <span className="text-blue-500 uppercase">chat</span>
            </h1>
            <p className="text-gray-600 dark:text-white mt-2">
                Para acceder a un chat, selecciona uno de la lista de chats a la izquierda.
            </p>
        </div>
    </div>
    )
}

export default ChatWelcome