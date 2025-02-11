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
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
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
                setChats(data);
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

    const getChatMessages = async (chatId) => {
        try {
            setLoadingMessages(true);
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/v1/messages/${chatId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            let data = response.data;

            if (response.status === 200) {
                setMessages(data);
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
            setLoadingMessages(false);
        }
    };

    const sendMessage = async (chatId, message) => {
        try {
            setLoadingMessages(true);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/v1/send-message/${chatId}`, { 
                content: message 
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
                getChatMessages(chatId);
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
            setLoadingMessages(false);
        }
    };

    const deleteChat = async (chatId) => {
        try {
            setLoading(true);
            const response = await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/v1/chat/${chatId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = response.data;

            if (response.status === 200) {
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

    const inviteToChat = async (chatId, userEmail) => {
        try {
            setLoading(true);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/v1/invite-user/${chatId}`, { 
                user_email: userEmail
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
        const token = localStorage.getItem('token');
        if (token) {
            getChats();
        }
    }, []);

    return (
        <ChatContext.Provider value={{ chats, loading, notification, messages, selectedChat, setSelectedChat, getChats, createChat, getChatMessages, sendMessage, deleteChat, inviteToChat }}>
            {children}
        </ChatContext.Provider>
    );
};