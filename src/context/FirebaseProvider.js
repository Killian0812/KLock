import { createContext, useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const FirebaseContext = createContext({});

export const FirebaseProvider = ({ children }) => {
    const [app, setApp] = useState(null);
    const [storage, setStorage] = useState(null);

    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyBJ8ZTPxvpMvBJp6s6l_4eNvJFiUfpsB8k",
            authDomain: "klock-firebase.firebaseapp.com",
            projectId: "klock-firebase",
            storageBucket: "klock-firebase.appspot.com",
            messagingSenderId: "1006560419150",
            appId: "1:1006560419150:web:e7955b66486afc9e8b521f"
        };
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        setApp(app);
        setStorage(storage);
    }, []);

    return (
        <FirebaseContext.Provider value={{ app, storage }}>
            {children}
        </FirebaseContext.Provider>
    )
}

export default FirebaseContext;