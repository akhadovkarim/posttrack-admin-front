import { useEffect, useState } from "react";
import { getBlogPosts, adminCreatePost, adminUpdatePost, adminDeletePost } from "../services/api";
import BlogForm from "../components/BlogForm";

export default function BlogAdmin() {
    const [items, setItems] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const load = async () => {
        const data = await getBlogPosts({ limit: 100, offset: 0 }); // вернёт только published; для админки можно сделать отдельный эндпоинт список ВСЕХ при желании
        setItems(data);
    };

    useEffect(() => { load(); }, []);

    const onCreate = async (payload) => {
        await adminCreatePost(payload);
        setFormOpen(false);
        await load();
    };

    const onUpdate = async (id, payload) => {
        await adminUpdatePost(id, payload);
        setEditItem(null);
        setFormOpen(false);
        await load();
    };

    const onDelete = async (id) => {
        if (!confirm("Удалить статью?")) return;
        await adminDeletePost(id);
        await load();
    };

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Блог</h1>
                <button
                    onClick={() => { setEditItem(null); setFormOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Добавить статью
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-gray-900 border border-gray-700 text-sm">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Заголовок</th>
                        <th className="px-4 py-3 text-left">Слаг</th>
                        <th className="px-4 py-3 text-left">Категория</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                        <th className="px-4 py-3 text-left">Опубликовано</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(p => (
                        <tr key={p.id} className="hover:bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-2">{p.id}</td>
                            <td className="px-4 py-2">{p.title}</td>
                            <td className="px-4 py-2">{p.slug}</td>
                            <td className="px-4 py-2">{p.category}</td>
                            <td className="px-4 py-2">{p.status}</td>
                            <td className="px-4 py-2">{p.published_at ? new Date(p.published_at).toLocaleString() : "-"}</td>
                            <td className="px-4 py-2 space-x-3">
                                <button className="text-blue-400 hover:underline" onClick={() => { setEditItem(p); setFormOpen(true); }}>Редактировать</button>
                                <button className="text-red-400 hover:underline" onClick={() => onDelete(p.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {formOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
                        <BlogForm
                            initial={editItem}
                            onCancel={() => setFormOpen(false)}
                            onSave={(payload) => editItem ? onUpdate(editItem.id, payload) : onCreate(payload)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
