import { createContext, useContext, useState } from 'react';
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
            const response = await axios.post('/api/v1/user/login', { email, password });
            const data = response.data;

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                setUser({
                    email: data.email,
                    name: data.name
                });
                setNotification({ type: 'success', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                    navigate('/view/chats');
                }, 3000);
            } else {
                setNotification({ type: 'error', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ type: 'error', content: error.message });
            setTimeout(() => {
                setNotification({ type: 'success', content: '' });
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const profile = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = response.data;

            if (response.status === 200) {
                setUser({
                    email: data.email,
                    name: data.name
                });
            } else {
                setNotification({ type: 'error', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ type: 'error', content: error.message });
            setTimeout(() => {
                setNotification({ type: 'success', content: '' });
                localStorage.removeItem('token');
                navigate('/');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            profile,
            loading,
            notification
        }}>
            {children}
        </AuthContext.Provider>
    );
};