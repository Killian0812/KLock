import { createContext, useState } from "react";

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
    const [newRequests, setNewRequests] = useState([]);
    return (
        <NotificationContext.Provider value={{ newRequests, setNewRequests }}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext;