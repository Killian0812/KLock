import { createContext, useState, useEffect } from "react";
import useAuth from '../hooks/useAuth';
import io from "socket.io-client";

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        if (auth?.username) {
            console.log(`Has auth: ${auth.username}`);
            const newSocket = io("http://192.168.1.3:8080", {
                query: {
                    username: auth.username,
                },
            });
            console.log(newSocket);
            setSocket(newSocket);
        } else {
            console.log(`No auth`);
        }
    }, [auth]);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContext;