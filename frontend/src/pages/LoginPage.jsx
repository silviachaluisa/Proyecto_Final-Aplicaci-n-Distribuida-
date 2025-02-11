import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

// Importacion de contextos
import { useAuth } from '../context/AuthProvider';

// Importacion de componentes
import Notification from '../components/Notification';

const LoginPage = () => {
    const { login, notification } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [disabledButton, setDisabledButton] = useState(true);
    const [formLogin, setFormLogin] = useState({
        email: '',
        password: ''
    });

    const handleChanges = (e) => {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value
        });
    }

    const handleShowPass = () => {
        setShowPass(!showPass);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formLogin.email, formLogin.password);
    }

    useEffect(() => {
        const allFieldsFilled = Object.values(formLogin).every(value => value.trim() !== '');
        setDisabledButton(!allFieldsFilled);
    }, [formLogin]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-screen">
            { notification.content && <Notification type={ notification.type } content={ notification.content } /> }
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
                    Te damos la bienvenida a <span className="text-blue-500 uppercase">Instamessage</span>
                </h1>
                <form className="space-y-4" onSubmit={ handleSubmit }>
                    <input
                        type="email"
                        id="email" 
                        name="email"
                        placeholder="Correo"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={ formLogin.email }
                        onChange={ handleChanges }
                    />
                    
                    <div className="relative">
                        <input
                            type={ showPass ? "text" : "password" }
                            name="password"
                            id="password"
                            placeholder="Contraseña"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={ formLogin.password }
                            onChange={ handleChanges }
                        />
                        { 
                            showPass ? 
                            <FaEyeSlash onClick={ handleShowPass } className="absolute right-4 top-4 cursor-pointer text-center text-gray-500 dark:text-gray-500 text-xl" data-tooltip-id='toggle-pass' data-tooltip-content='Ocultar contraseña'/> 
                            :
                            <FaEye onClick={ handleShowPass } className="absolute right-4 top-4 cursor-pointer text-center text-gray-500 dark:text-gray-500 text-xl" data-tooltip-id='toggle-pass' data-tooltip-content='Mostrar contraseña'/>
                        }
                        <ReactTooltip id='toggle-pass' place='top' effect='solid' className='bg-gray-800 text-white p-2 rounded-lg'/>
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-2 px-4 rounded-lg transition ${ disabledButton ? 'bg-gray-700' : 'bg-blue-500 hover:bg-blue-700' }`}
                        style={{ cursor: disabledButton ? 'not-allowed' : 'pointer' }}
                        disabled={ disabledButton }
                    >
                        Iniciar sesión
                    </button>
                    
                    <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: "0%" }}></div>
                    </div>
                    <p className="dark:text-white text-center">
                        No tienes cuenta, <Link to="/register" className="text-blue-500 hover:text-blue-600 font-bold">Regístrate</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
