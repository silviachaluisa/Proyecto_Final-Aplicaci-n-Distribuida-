import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({
        type: 'success',
        content: ''
    });

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/v1/user/login', { email, password });
            const data = response.data;

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                setUser({
                    email: data.email,
                    name: data.name,
                    id: data.uid
                });
                setNotification({ type: 'success', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                    navigate('/chats');
                }, 3000);
            } else {
                setNotification({ type: 'error', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ type: 'error', content: error.response.data.message });
            setTimeout(() => {
                setNotification({ type: 'success', content: '' });
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, Cpassword) => {
        try {
            if (password !== Cpassword) {
                setNotification({ type: 'error', content: 'Las contraseñas no coinciden' });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
                return;
            }

            setLoading(true);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/v1/user/register', { name, email, password });
            const data = response.data;

            if (response.status === 201) {
                setNotification({ type: 'success', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                    navigate('/login');
                }, 3000);
            } else {
                setNotification({ type: 'error', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ type: 'error', content: error.response.data.message });
            setTimeout(() => {
                setNotification({ type: 'success', content: '' });
            }, 3000);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const profile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/v1/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = response.data;

            if (response.status === 200) {
                setUser({
                    email: data.email,
                    name: data.name,
                    id: data.id
                });
            } else {
                setNotification({ type: 'error', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ type: 'error', content: error.response.data.message });
            setTimeout(() => {
                setNotification({ type: 'success', content: '' });
                localStorage.removeItem('token');
                navigate('/');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            profile();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            profile,
            loading,
            notification
        }}>
            {children}
        </AuthContext.Provider>
    );
};