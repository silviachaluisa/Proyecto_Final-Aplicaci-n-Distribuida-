import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

// Importacion de contextos
import { useAuth } from '../context/AuthProvider';

// Importacion de componentes
import Notification from '../components/Notification';

const RegisterPage = () => {
    const { register, notification } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [disabledButton, setDisabledButton] = useState(true);
    const [formRegister, setFormRegister] = useState({
        username: '',
        email: '',
        password: '',
        Cpassword: ''
    });

    const handleChanges = (e) => {
        setFormRegister({
            ...formRegister,
            [e.target.name]: e.target.value
        });
    }
    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Te damos la bienvenida a <span className="text-blue-500 uppercase">Instamessage</span>
        </h1>
        <form className="space-y-4">
            <input
                type="text"
                id="username"
                name="username"
                placeholder="Nombre de usuario"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={ formRegister.username }
                onChange={ handleChanges }
            />

            <input
                type="email"
                id="email"
                name="email"
                placeholder="Correo"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={ formRegister.email }
                onChange={ handleChanges }
            />
            
            <div className="relative">
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Contraseña"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={ formRegister.password }
                    onChange={ handleChanges }
                />
                <i id="toggle-pass" className="fa fa-eye absolute right-4 top-5 cursor-pointer text-gray-500 dark:text-gray-300"></i>
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="Cpassword"
                    id="Cpassword"
                    placeholder="Repite la contraseña"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={ formRegister.Cpassword }
                    onChange={ handleChanges }
                />
                <i id="toggle-pass-2" className="fa fa-eye absolute right-4 top-5 cursor-pointer text-gray-500 dark:text-gray-300"></i>
            </div>

            <button
                id="register-btn"
                className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition cursor-not-allowed"
                disabled={ disabledButton }
            >
                Registrarse
            </button>

            <div className="flex flex-col items-start my-4 w-full">
                <small id="password-strength-text" className="dark:text-white text-sm mb-1"></small>
                <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden">
                    <div id="password-strength-meter" className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: "0%" }}></div>
                </div>
            </div>

            <p className="dark:text-white text-center">Ya tienes una cuenta, <Link to="/" className="text-blue-500 font-bold">Inicia sesión</Link></p>
        </form>
    </div>
        </div>
    )
}

export default RegisterPage
