import { useEffect, useState } from "react";
import { getClients } from "../services/api";

const PaymentForm = ({ initialData = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        client_id: "",
        amount: "",
        currency: "USD",
        payment_method: "",
        status: "paid",
        paid_at: "",
        period_from: "",
        period_to: "",
        invoice_link: "",
        comment: "",
    });

    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                setClients(data);
            } catch (e) {
                console.error("Failed to load clients", e);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                paid_at: initialData.paid_at?.slice(0, 16) || "",
                period_from: initialData.period_from?.slice(0, 16) || "",
                period_to: initialData.period_to?.slice(0, 16) || "",
                comment: initialData.comment || "",
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
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div>
                <label className="block text-sm font-medium mb-1">Клиент</label>
                <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                >
                    <option value="">Выберите клиента</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.company_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Сумма</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Валюта</label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="UZS">UZS</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Метод оплаты</label>
                    <input
                        type="text"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Статус</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    >
                        <option value="paid">Оплачен</option>
                        <option value="failed">Ошибка</option>
                        <option value="refunded">Возврат</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Дата платежа</label>
                    <input
                        type="datetime-local"
                        name="paid_at"
                        value={formData.paid_at}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ссылка на счёт</label>
                    <input
                        type="url"
                        name="invoice_link"
                        value={formData.invoice_link}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Период с</label>
                    <input
                        type="datetime-local"
                        name="period_from"
                        value={formData.period_from}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Период по</label>
                    <input
                        type="datetime-local"
                        name="period_to"
                        value={formData.period_to}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Комментарий</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-24"
                    placeholder="Комментарий (необязательно)"
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

export default PaymentForm;
