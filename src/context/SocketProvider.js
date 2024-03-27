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
            const newSocket = io("", {
                query: {
                    username: auth.username,
                },
            });
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