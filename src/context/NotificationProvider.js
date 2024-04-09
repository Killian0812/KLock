import { createContext, useState } from "react";

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
    const [newRequests, setNewRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [visible, setVisible] = useState(false);
    const [viewed, setViewed] = useState(true);

    return (
        <NotificationContext.Provider value={{
            newRequests, setNewRequests,
            notifications, setNotifications,
            visible, setVisible,
            viewed, setViewed
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext;