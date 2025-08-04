// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            setUser({ username: "admin" }); // можно расшифровывать JWT, но сейчас просто
        }
    }, [token]);

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: "include",
            body: formData,
        });

        if (!res.ok) throw new Error("Неверный логин или пароль");

        setUser({ username }); // просто ставим user, без токена
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
