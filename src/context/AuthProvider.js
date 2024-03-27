import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const [trusted, setTrusted] = useState(JSON.parse(localStorage.getItem("trusted") || false));

    return (
        <AuthContext.Provider value={{ auth, setAuth, trusted, setTrusted, logoutConfirm, setLogoutConfirm }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;