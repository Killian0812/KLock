import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [trusted, setTrusted] = useState(JSON.parse(localStorage.getItem("trusted") || false));

    return (
        <AuthContext.Provider value={{ auth, setAuth, trusted, setTrusted }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;