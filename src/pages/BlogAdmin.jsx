import { useEffect, useMemo, useState } from "react";
import {
    adminListPosts,
    adminCreatePost,
    adminUpdatePost,
    adminDeletePost,
} from "../services/api";
import BlogForm from "../components/BlogForm";

const CATEGORY_OPTIONS = [
    { value: "", label: "Все категории" },
    { value: "cases", label: "Кейсы" },
    { value: "guides", label: "Гайды" },
    { value: "news", label: "Новости" },
];

const STATUS_BADGE = {
    draft: "bg-yellow-900/40 text-yellow-300 border-yellow-700/60",
    published: "bg-green-900/40 text-green-300 border-green-700/60",
    archived: "bg-gray-700/50 text-gray-300 border-gray-600/70",
};

function Badge({ text, variant }) {
    return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs border ${STATUS_BADGE[variant] || "bg-gray-800 text-gray-300 border-gray-700"}`}>
      {text}
    </span>
    );
}

export default function BlogAdmin() {
    const [items, setItems] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const [q, setQ] = useState("");
    const [cat, setCat] = useState("");

    const load = async () => {
        const data = await adminListPosts({
            limit: 200,
            offset: 0,
            q: q || undefined,              // не шлём пустую строку
            category: cat || undefined,     // не шлём пустую строку
        });
        setItems(data.items);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        const f = (q || "").trim().toLowerCase();
        if (!f) return items;
        return items.filter(
            (p) =>
                p.title?.toLowerCase().includes(f) ||
                p.summary?.toLowerCase().includes(f) ||
                p.slug?.toLowerCase().includes(f)
        );
    }, [items, q]);

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
        <div className="p-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Блог</h1>
                    <p className="text-sm text-gray-400">Создавайте и редактируйте статьи</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Поиск по заголовку/описанию/слагу"
                        className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                    />
                    <select
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                    >
                        {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={load}
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded text-sm"
                    >
                        Применить
                    </button>
                    <button
                        onClick={() => { setEditItem(null); setFormOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                    >
                        Новая статья
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow border border-gray-700">
                <table className="min-w-full bg-gray-900 text-sm">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700 text-gray-300">
                        <th className="px-4 py-3 text-left">Заголовок</th>
                        <th className="px-4 py-3 text-left">Слаг</th>
                        <th className="px-4 py-3 text-left">Категория</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                        <th className="px-4 py-3 text-left">Опубликовано</th>
                        <th className="px-4 py-3 text-left">Обновлено</th>
                        <th className="px-4 py-3 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-800/60">
                            <td className="px-4 py-2">
                                <div className="font-medium">{p.title}</div>
                                <div className="text-xs text-gray-400 line-clamp-1">{p.summary || "-"}</div>
                            </td>
                            <td className="px-4 py-2 text-gray-300">{p.slug}</td>
                            <td className="px-4 py-2">
                                <Badge
                                    text={p.category === "cases" ? "Кейсы" : p.category === "guides" ? "Гайды" : "Новости"}
                                    variant="default"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <Badge text={p.status} variant={p.status} />
                            </td>
                            <td className="px-4 py-2">{p.published_at ? new Date(p.published_at).toLocaleString() : "-"}</td>
                            <td className="px-4 py-2">{p.updated_at ? new Date(p.updated_at).toLocaleString() : "-"}</td>
                            <td className="px-4 py-2 space-x-3">
                                <button
                                    className="text-blue-400 hover:underline"
                                    onClick={() => { setEditItem(p); setFormOpen(true); }}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="text-red-400 hover:underline"
                                    onClick={() => onDelete(p.id)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td className="px-4 py-10 text-center text-gray-400" colSpan={7}>
                                Ничего не найдено
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {formOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                            <div className="text-lg font-semibold">{editItem ? "Редактировать статью" : "Новая статья"}</div>
                            <button
                                onClick={() => setFormOpen(false)}
                                className="text-gray-300 hover:text-white"
                                aria-label="Закрыть"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <BlogForm
                                initial={editItem}
                                onCancel={() => setFormOpen(false)}
                                onSave={(payload) => editItem ? onUpdate(editItem.id, payload) : onCreate(payload)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
