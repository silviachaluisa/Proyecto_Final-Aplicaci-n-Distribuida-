import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export const useSocket = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        // Conectar al servidor
        socketRef.current = io(SOCKET_SERVER_URL, {
            autoConnect: true,
            transports: ["websocket"],
        });

        // Confirmar conexión
        socketRef.current.on("connect", () => {
            setSocketConnected(true);
            console.log("🔗 Conectado a Socket.io");
        });

        // Manejar desconexión
        socketRef.current.on("disconnect", () => {
            setSocketConnected(false);
            console.log("❌ Desconectado de Socket.io");
        });

        // Limpieza al desmontar el componente
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return socketRef.current;
};
