import { useEffect, useState } from "react";
import {
    createTariff,
    getTariffs,
    updateTariff
} from "../services/api";
import PlanForm from "../components/PlanForm";

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const loadPlans = async () => {
        try {
            const data = await getTariffs();
            setPlans(data);
        } catch (e) {
            console.error("Ошибка загрузки тарифов", e);
        }
    };

    const handleCreate = () => {
        setSelected(null);
        setFormVisible(true);
    };

    const handleEdit = (plan) => {
        setSelected(plan);
        setFormVisible(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selected) {
                await updateTariff(selected.id, formData);
            } else {
                await createTariff(formData);
            }
            setFormVisible(false);
            await loadPlans();
        } catch (e) {
            console.error("Ошибка сохранения тарифа", e);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Тарифы</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
                    onClick={handleCreate}
                >
                    Добавить тариф
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-gray-900 border border-gray-700 text-sm text-white">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Название</th>
                        <th className="px-4 py-3 text-left">Цена</th>
                        <th className="px-4 py-3 text-left">Описание</th>
                        <th className="px-4 py-3 text-left">Тип</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-2">{plan.id}</td>
                            <td className="px-4 py-2">{plan.name}</td>
                            <td className="px-4 py-2">{plan.price}</td>
                            <td className="px-4 py-2">{plan.description}</td>
                            <td className="px-4 py-2">{plan.type}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleEdit(plan)}
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
                            {selected ? "Редактировать тариф" : "Добавить тариф"}
                        </h2>
                        <PlanForm
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

export default PlansPage;
