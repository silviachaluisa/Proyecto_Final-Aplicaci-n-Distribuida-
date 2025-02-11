import React, { useState } from 'react'
import { BsSendFill } from "react-icons/bs";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importación de contextos
import { useChat } from '../context/ChatProvider';

const FooterChat = () => {
    const { selectedChat, sendMessage } = useChat();
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        sendMessage(selectedChat.id, message);
        setMessage('');
    };

    return (
        <div className='flex items-center justify-between w-full p-4 bg-gray-500 dark:bg-gray-700 rounded-b-lg'>
            <input
                type="text"
                id="message-input"
                className="w-full p-2 m-2 bg-transparent dark:text-white"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={handleChange}
            />
            <button
                className="bg-blue-500 dark:bg-blue-700 text-white rounded-lg cursor-not-allowed"
                disabled={!message}
                onClick={handleSendMessage}
                data-tooltip-id='sendMessage'
                data-tooltip-content='Enviar mensaje'
            >
                <span>
                    <BsSendFill className="text-xl" />
                </span>
            </button>
            <ReactTooltip id='sendMessage' place='top' />
        </div>
    )
}

export default FooterChat
