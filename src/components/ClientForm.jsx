import React, { useState, useEffect } from "react";
import { getTariffs } from "../services/api";

const ClientForm = ({ initialData = null, onSave, onCancel }) => {
    const [tariffs, setTariffs] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        company_name: "",
        domain: "",
        contact: "",
        telegram_chat_id: "",
        tariff: "",
        status: "trial",
        expires_at: "",
        custom_price: "", // добавлено
    });

    useEffect(() => {
        const loadTariffs = async () => {
            try {
                const data = await getTariffs();
                setTariffs(data);
            } catch (e) {
                console.error("Ошибка загрузки тарифов", e);
            }
        };
        loadTariffs();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || "",
                company_name: initialData.company_name || "",
                domain: initialData.domain || "",
                contact: initialData.contact || "",
                telegram_chat_id: initialData.telegram_chat_id?.toString() || "",
                tariff: initialData.tariff || "",
                status: initialData.status || "trial",
                expires_at: initialData.expires_at?.slice(0, 16) || "",
                custom_price: initialData.custom_price?.toString() || "", // добавлено
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            telegram_chat_id: formData.telegram_chat_id
                ? parseInt(formData.telegram_chat_id, 10)
                : null,
            custom_price: formData.tariff === "custom" && formData.custom_price
                ? parseFloat(formData.custom_price)
                : null,
        };

        onSave(payload);
    };

    const isCustomTariff = formData.tariff === "custom";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-white">
            <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    disabled={!!initialData}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Компания</label>
                <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Домен</label>
                <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Контакт</label>
                <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Telegram Chat ID</label>
                <input
                    type="text"
                    name="telegram_chat_id"
                    value={formData.telegram_chat_id}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Тариф</label>
                <select
                    name="tariff"
                    value={formData.tariff}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                >
                    <option value="">Выберите тариф</option>
                    {tariffs.map((tariff) => (
                        <option key={tariff.id} value={tariff.id}>
                            {tariff.name} — {tariff.price || 0}$
                        </option>
                    ))}
                </select>
            </div>

            {isCustomTariff && (
                <div>
                    <label className="block text-sm font-medium mb-1">Индивидуальная цена (USD)</label>
                    <input
                        type="number"
                        name="custom_price"
                        value={formData.custom_price}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                        step="0.01"
                        required
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Истекает</label>
                <input
                    type="datetime-local"
                    name="expires_at"
                    value={formData.expires_at}
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

export default ClientForm;
