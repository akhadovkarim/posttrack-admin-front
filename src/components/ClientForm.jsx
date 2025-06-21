import React, { useState, useEffect } from "react";

const ClientForm = ({ initialData = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: "",
        company_name: "",
        domain: "",
        contact: "",
        tariff: "starter",
        status: "trial",
        expires_at: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                expires_at: initialData.expires_at?.slice(0, 16) || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

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
                <label className="block text-sm font-medium mb-1">Тариф</label>
                <select
                    name="tariff"
                    value={formData.tariff}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="team">Team</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

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
