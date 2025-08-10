// src/pages/Users.jsx
import { useEffect, useState } from "react";
import {
    getClients,
    createClient,
    updateClient,
    provisionClient,
    deprovisionClient,
} from "../services/api";
import ClientForm from "../components/ClientForm";
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
    const map = {
        active: "bg-green-700",
        trial: "bg-blue-700",
        expired: "bg-yellow-700",
        blocked: "bg-red-700",
        provisioning: "bg-purple-700",
        failed: "bg-red-800",
    };
    const cls = map[status] || "bg-gray-700";
    return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{status}</span>;
};

const Users = () => {
    const [clients, setClients] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [loadingId, setLoadingId] = useState(null);

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
            const payload = {
                ...formData,
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
            };

            if (selected) {
                await updateClient(selected.id, payload);
                toast.success(`Клиент ${payload.company_name} обновлён`);
            } else {
                await createClient(payload);
                toast.success(`Клиент ${payload.company_name} создан`);
            }

            setFormVisible(false);
            loadClients();
        } catch (e) {
            console.error("Failed to save client", e);
            toast.error(`Ошибка сохранения: ${e.message || e}`);
        }
    };
    const doProvision = async (slug) => {
        try {
            setLoadingId(slug);
            await provisionClient(slug);
            toast.success(`Инстанс для ${slug} успешно создан`);
            loadClients();
        } catch (e) {
            console.error("Provision failed", e);
            toast.error(`Не удалось создать инстанс: ${e.message || e}`);
        } finally {
            setLoadingId(null);
        }
    };

    const doDeprovision = async (slug) => {
        try {
            setLoadingId(slug);
            await deprovisionClient(slug);
            toast.success(`Инстанс ${slug} удалён`);
            loadClients();
        } catch (e) {
            console.error("Deprovision failed", e);
            toast.error(`Не удалось удалить инстанс: ${e.message || e}`);
        } finally {
            setLoadingId(null);
        }
    };


    useEffect(() => {
        loadClients();
    }, []);

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Клиенты</h1>
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
                        <th className="px-4 py-3 text-left">WEB‑домен</th>
                        <th className="px-4 py-3 text-left">API‑домен</th>
                        <th className="px-4 py-3 text-left">Контакт</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((c) => (
                        <tr
                            key={c.id}
                            className="hover:bg-gray-800 border-b border-gray-700"
                        >
                            <td className="px-4 py-2">{c.id}</td>
                            <td className="px-4 py-2">{c.company_name}</td>
                            <td className="px-4 py-2">{c.domain}</td>
                            <td className="px-4 py-2">{c.api_domain}</td>
                            <td className="px-4 py-2">{c.contact}</td>
                            <td className="px-4 py-2">
                                <StatusBadge status={c.status} />
                            </td>
                            <td className="px-4 py-2 space-x-3">
                                <button
                                    onClick={() => handleEdit(c)}
                                    className="text-blue-400 hover:underline"
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => doProvision(c.slug)}
                                    disabled={loadingId === c.slug}
                                    className="text-green-400 hover:underline disabled:opacity-50"
                                >
                                    Создать инстанс
                                </button>
                                <button
                                    onClick={() => doDeprovision(c.slug)}
                                    disabled={loadingId === c.slug}
                                    className="text-red-400 hover:underline disabled:opacity-50"
                                >
                                    Удалить инстанс
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {formVisible && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setFormVisible(false)}
                    />
                    <div className="relative mx-auto my-6 max-w-4xl w-[96%] bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                            <h2 className="text-lg font-semibold text-white">
                                {selected ? "Редактировать клиента" : "Добавить клиента"}
                            </h2>
                            <button
                                onClick={() => setFormVisible(false)}
                                className="text-gray-400 hover:text-white text-xl font-bold"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[70vh]">
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
