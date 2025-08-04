import { useState, useEffect } from "react";

const initialForm = {
    name: "",
    price: "",
    duration_days: "",
    features: ""
};

const PlanForm = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                price: initialData.price || "",
                duration_days: initialData.duration_days || "",
                features: (initialData.features || []).join(", ")
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = {
            ...form,
            price: parseFloat(form.price),
            duration_days: parseInt(form.duration_days, 10),
            features: form.features.split(",").map((f) => f.trim())
        };
        onSave(dataToSend);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-300 mb-1">Название тарифа</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-300 mb-1">Цена (USD)</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-300 mb-1">Длительность (дней)</label>
                <input
                    type="number"
                    name="duration_days"
                    value={form.duration_days}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-300 mb-1">Особенности (через запятую)</label>
                <input
                    type="text"
                    name="features"
                    value={form.features}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Сохранить
                </button>
            </div>
        </form>
    );
};

export default PlanForm;
