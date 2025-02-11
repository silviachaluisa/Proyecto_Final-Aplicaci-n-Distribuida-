import React from 'react'
import { MdMarkChatUnread } from "react-icons/md";
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className='bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-screen'>
            <MdMarkChatUnread className='text-9xl text-blue-500 dark:text-blue-700' />
            <h1 className='text-4xl font-semibold text-gray-800 dark:text-white'>
                Te damos la bienvenida a <span className="text-blue-500 uppercase">Instamessage</span>
            </h1>
            <p className='text-lg font-semibold text-gray-600 dark:text-gray-400'>
                <Link to='/login' className='text-blue-500 hover:text-blue-600'>Inicia sesión</Link> o <Link to='/register' className='text-blue-500 hover:text-blue-600'>registrate</Link> para comenzar a chatear
            </p>
        </div>
    )
}

export default WelcomePage
