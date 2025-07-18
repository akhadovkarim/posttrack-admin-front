import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.username, form.password);
            navigate("/");
        } catch (err) {
            setError("Ошибка авторизации");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow w-80">
                <h1 className="text-white text-xl mb-4">Вход в админку</h1>
                <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                    required
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
