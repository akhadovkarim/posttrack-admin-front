import { useEffect, useState } from "react";
import { getExpenses, createExpense, deleteExpense } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [formVisible, setFormVisible] = useState(false);

    const loadExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to load expenses", error);
        }
    };

    const handleCreate = async (expenseData) => {
        try {
            await createExpense(expenseData);
            setFormVisible(false);
            loadExpenses();
        } catch (error) {
            console.error("Failed to create expense", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить расход?")) return;
        try {
            await deleteExpense(id);
            loadExpenses();
        } catch (error) {
            console.error("Failed to delete expense", error);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Расходы</h1>
                <button
                    onClick={() => setFormVisible(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                    Добавить расход
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-gray-900 border border-gray-700 text-sm text-white">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Категория</th>
                        <th className="px-4 py-3 text-left">Сумма</th>
                        <th className="px-4 py-3 text-left">Валюта</th>
                        <th className="px-4 py-3 text-left">Дата</th>
                        <th className="px-4 py-3 text-left">Комментарий</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expenses.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-2">{e.id}</td>
                            <td className="px-4 py-2">{e.category}</td>
                            <td className="px-4 py-2">{e.amount}</td>
                            <td className="px-4 py-2">{e.currency}</td>
                            <td className="px-4 py-2">{new Date(e.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{e.comment || "-"}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleDelete(e.id)}
                                    className="text-red-400 hover:underline"
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {formVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md p-6">
                        <ExpenseForm
                            onSave={handleCreate}
                            onCancel={() => setFormVisible(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
