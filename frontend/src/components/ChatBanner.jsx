import React from 'react'
import { FaUserGroup, FaUser } from "react-icons/fa6";

const ChatBanner = ({ chatInfo }) => {
    return (
        <div className='flex items-center justify-evenly w-full p-3 border-b rounded-lg border-gray-300 dark:border-gray-100 dark:bg-gray-700 hover:bg-slate-800 dark:hover:bg-slate-800 cursor-pointer transition duration-300'>
            <div className="w-14 h-12 bg-gray-300 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-900">
                    {
                        chatInfo.is_group ? <FaUserGroup className="text-gray-500 dark:text-gray-300 text-2xl" /> : <FaUser className="text-gray-500 dark:text-gray-300 text-2xl" />
                    }
                </div>
                <div className="flex flex-col items-start justify-center w-full ml-4">
                    <p className="text-gray-800 dark:text-white font-semibold">${chatInfo.name}</p>
                    <div className="flex flex-col md:flex-row items-end justify-between w-full">
                        <small className="text-gray-500 dark:text-gray-400">${chatInfo.ownerUser.name}</small>
                            {chatInfo.is_group ? `<small className='text-gray-500 dark:text-gray-400'>${chat.nUsers} Usuarios</small>` : ""}
                        <small className="text-gray-500 dark:text-gray-400">${chatInfo.is_group ? "Grupo" : "Chat"} ${chatInfo.is_public ? "publico" : "privado"}</small>
                    </div>
                </div>
        </div>
    )
}

export default ChatBanner
