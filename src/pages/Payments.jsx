import { useEffect, useState } from "react";
import { getPayments, createPayment, updatePayment } from "../services/api";
import PaymentForm from "../components/PaymentForm";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const loadPayments = async () => {
        try {
            const data = await getPayments();
            setPayments(data);
        } catch (e) {
            console.error("Failed to load payments", e);
        }
    };

    const handleCreate = () => {
        setSelected(null);
        setFormVisible(true);
    };

    const handleEdit = (payment) => {
        setSelected(payment);
        setFormVisible(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selected) {
                await updatePayment(selected.id, formData);
            } else {
                await createPayment(formData);
            }
            setFormVisible(false);
            await loadPayments();
        } catch (e) {
            console.error("Failed to save payment", e);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Платежи</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
                    onClick={handleCreate}
                >
                    Добавить платёж
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-gray-900 border border-gray-700 text-sm text-white">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Клиент</th>
                        <th className="px-4 py-3 text-left">Сумма</th>
                        <th className="px-4 py-3 text-left">Валюта</th>
                        <th className="px-4 py-3 text-left">Дата</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-2">{p.id}</td>
                            <td className="px-4 py-2">{p.client_id}</td>
                            <td className="px-4 py-2">{p.amount}</td>
                            <td className="px-4 py-2">{p.currency}</td>
                            <td className="px-4 py-2">{new Date(p.paid_at).toLocaleString()}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="text-blue-400 hover:underline"
                                >
                                    Редактировать
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {formVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {selected ? "Редактировать платёж" : "Добавить платёж"}
                        </h2>
                        <PaymentForm
                            initialData={selected}
                            onSave={handleSubmit}
                            onCancel={() => setFormVisible(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
