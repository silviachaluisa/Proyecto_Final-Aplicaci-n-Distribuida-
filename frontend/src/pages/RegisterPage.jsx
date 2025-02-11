import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

// Importación de contextos
import { useAuth } from '../context/AuthProvider';

// Importación de componentes
import Notification from '../components/Notification';

const RegisterPage = () => {
    const { register, notification } = useAuth();
    
    const [strengthPass, setStrengthPass] = useState({ level: 0, value: 0, text: '' });
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
        const { name, value } = e.target;
        setFormRegister(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleShowPass = (field) => {
        if (field === "password") {
            setShowPass(prev => !prev);
        } else {
            setShowPass2(prev => !prev);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(formRegister.username, formRegister.email, formRegister.password, formRegister.Cpassword);
    };

    const checkStrengthPass = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[!@#$%^&*()]/.test(pass)) strength++;

        strength = Math.min(strength, 4);
        const strengthLevels = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];

        setStrengthPass({
            level: strength,
            value: strength * 25,
            text: strengthLevels[strength],
        });
    };

    useEffect(() => {
        checkStrengthPass(formRegister.password);

        const allFieldsFilled = Object.values(formRegister).every(value => value.trim() !== '');
        const passwordsMatch = formRegister.password === formRegister.Cpassword;
        const strongEnough = strengthPass.level >= 2;

        setDisabledButton(!(allFieldsFilled && passwordsMatch && strongEnough));
    }, [formRegister]); 

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-screen">
            { notification.content && <Notification type={ notification.type } content={ notification.content } /> }
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
                    Te damos la bienvenida a <span className="text-blue-500 uppercase">Instamessage</span>
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                        value={formRegister.username}
                        onChange={handleChanges}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                        value={formRegister.email}
                        onChange={handleChanges}
                    />
                    
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                            value={formRegister.password}
                            onChange={handleChanges}
                        />
                        {showPass ? 
                            <FaEyeSlash
                                onClick={() => handleShowPass("password")}
                                className="absolute right-4 top-4 cursor-pointer text-gray-500 text-xl"
                                data-tooltip-id='toggle-pass'
                                data-tooltip-content='Ocultar contraseña'
                            /> :
                            <FaEye 
                                onClick={() => handleShowPass("password")}
                                className="absolute right-4 top-4 cursor-pointer text-gray-500 text-xl"
                                data-tooltip-id='toggle-pass'
                                data-tooltip-content='Mostrar contraseña'
                            />
                        }
                        <ReactTooltip id='toggle-pass' className=''/>
                    </div>

                    <div className="relative">
                        <input
                            type={showPass2 ? "text" : "password"}
                            name="Cpassword"
                            placeholder="Repite la contraseña"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                            value={formRegister.Cpassword}
                            onChange={handleChanges}
                        />
                        {showPass2 ? 
                            <FaEyeSlash
                                onClick={() => handleShowPass("Cpassword")}
                                className="absolute right-4 top-4 cursor-pointer text-gray-500 text-xl"
                                data-tooltip-id='toggle-pass-2'
                                data-tooltip-content='Ocultar contraseña'
                            /> :
                            <FaEye
                                onClick={() => handleShowPass("Cpassword")}
                                className="absolute right-4 top-4 cursor-pointer text-gray-500 text-xl"
                                data-tooltip-id='toggle-pass-2'
                                data-tooltip-content='Mostrar contraseña'
                            />
                        }
                        <ReactTooltip id='toggle-pass-2' className=''/>
                    </div>

                    <button
                        className={`w-full text-white font-bold py-2 px-4 rounded-lg ${disabledButton ? 'bg-gray-700' : 'bg-blue-700'} transition`}
                        style={{ cursor: disabledButton ? 'not-allowed' : 'pointer' }}
                        disabled={ disabledButton }
                    >
                        Registrarse
                    </button>
                    <div className="flex flex-col items-start my-4 w-full">
                        <small className='dark:text-white text-sm mb-1'>
                            Seguridad: {strengthPass.text}
                        </small>
                        <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${strengthPass.level == 0 ? 'bg-gray-700' : strengthPass.level == 1 ? 'bg-red-500' : strengthPass.level == 2 ? 'bg-orange-500' : strengthPass.level == 3 ? 'bg-yellow-500' : strengthPass.level == 4 ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${strengthPass.value}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="dark:text-white text-center">
                        No tienes cuenta, <Link to="/login" className="text-blue-500 hover:text-blue-600 font-bold">Inicia sesion</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
