import { useEffect, useState } from "react";
import { getClients, createClient, updateClient } from "../services/api";
import ClientForm from "../components/ClientForm";

const Users = () => {
    const [clients, setClients] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const loadClients = async () => {
        try {
            const data = await getClients();
            setClients(data);
        } catch (e) {
            console.error("Failed to load clients", e);
        }
    };

    const handleEdit = (client) => {
        setSelected(client);
        setFormVisible(true);
    };

    const handleCreate = () => {
        setSelected(null);
        setFormVisible(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selected) {
                await updateClient(selected.id, formData);
            } else {
                await createClient(formData);
            }
            setFormVisible(false);
            loadClients();
        } catch (e) {
            console.error("Failed to save client", e);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Пользователи</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
                    onClick={handleCreate}
                >
                    Добавить клиента
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-gray-900 border border-gray-700 text-sm text-white">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Компания</th>
                        <th className="px-4 py-3 text-left">Контакт</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((client) => (
                        <tr
                            key={client.id}
                            className="hover:bg-gray-800 border-b border-gray-700"
                        >
                            <td className="px-4 py-2">{client.id}</td>
                            <td className="px-4 py-2">{client.company_name}</td>
                            <td className="px-4 py-2">{client.contact}</td>
                            <td className="px-4 py-2">{client.status}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleEdit(client)}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white">
                                {selected ? "Редактировать клиента" : "Добавить клиента"}
                            </h2>
                            <button
                                onClick={() => setFormVisible(false)}
                                className="text-gray-400 hover:text-white text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            <ClientForm
                                initialData={selected}
                                onSave={handleSubmit}
                                onCancel={() => setFormVisible(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Users;
