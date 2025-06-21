import React, { useEffect, useState } from "react";
import { getClients } from "../services/api";

const ExpenseForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        client_id: "",
        category: "other",
        amount: "",
        currency: "USD",
        comment: "",
        date: new Date().toISOString().slice(0, 10),
    });

    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                setClients(data);
            } catch (e) {
                console.error("Failed to fetch clients", e);
            }
        };
        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-white"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Клиент</label>
                <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                >
                    <option value="">Выберите клиента</option>
                    {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.company_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                >
                    <option value="infrastructure">Инфраструктура</option>
                    <option value="services">Сервисы</option>
                    <option value="licenses">Лицензии</option>
                    <option value="employees">Сотрудники</option>
                    <option value="other">Другое</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Сумма</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                    step="0.01"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Валюта</label>
                <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UZS">UZS</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Комментарий</label>
                <input
                    type="text"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Дата</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-600 rounded bg-gray-700 hover:bg-gray-600 text-sm"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                    Сохранить
                </button>
            </div>
        </form>
    );
};

export default ExpenseForm;
