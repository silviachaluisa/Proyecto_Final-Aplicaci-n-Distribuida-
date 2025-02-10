import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

export const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({
        type: 'success',
        content: ''
    });

    const getChats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/v1/chats', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            let data = response.data;

            if (response.status === 200) {
                setChats(response);
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

    const createChat = async (name, is_group, is_public) => {
        try {
            setLoading(true);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/v1/create-chat', { 
                name, 
                is_group, 
                is_public
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = response.data;

            if (response.status === 201) {
                setNotification({ type: 'success', content: data.message });
                setTimeout(() => {
                    setNotification({ type: 'success', content: '' });
                }, 3000);
                getChats();
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

    useEffect(() => {
        getChats();
    }, []);

    return (
        <ChatContext.Provider value={{ chats, loading, notification, getChats, createChat }}>
            {children}
        </ChatContext.Provider>
    );
};