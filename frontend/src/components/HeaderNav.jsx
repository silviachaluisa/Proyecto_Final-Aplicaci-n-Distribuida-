import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";

const HeaderNav = () => {
    const { logout, user } = useAuth();
    return (
        <header className="w-full bg-gray-500 dark:bg-gray-800 fixed top-0 z-10 px-4 sm:px-6 md:px-8">
            <nav className="bg-gray-500 dark:bg-gray-800 w-full shadow-lg rounded-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
                    <Link to="/login" className="text-white hover:text-gray-300 font-bold text-lg">
                        InstaMessage
                    </Link>
                    
                    <div className="flex flex-col md:flex-row items-center space-x-4">
                        <Link to="/view/profile" className="text-white hover:text-gray-300 font-semibold flex items-center">
                            <FaUser className="text-xl" />
                            <span className="ml-2">
                                {user?.name || "No disponible"}
                            </span>
                        </Link>
                        <Link className="text-red-500 hover:text-red-700 font-semibold cursor-pointer flex items-center" to="/login">
                            <LuLogOut className="text-xl" />
                            <span className="ml-2" onClick={logout}>
                                Cerrar sesión
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default HeaderNav
