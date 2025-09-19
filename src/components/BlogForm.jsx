import { useState } from "react";

const CATEGORIES = [
    { value: "cases", label: "Кейсы" },
    { value: "guides", label: "Гайды" },
    { value: "news",  label: "Новости" },
];

const STATUSES = [
    { value: "draft", label: "Черновик" },
    { value: "published", label: "Опубликовано" },
    { value: "archived", label: "Архив" },
];

export default function BlogForm({ initial = null, onCancel, onSave }) {
    const [form, setForm] = useState(() => ({
        title: initial?.title || "",
        slug: initial?.slug || "",
        summary: initial?.summary || "",
        body_md: initial?.body_md || "",
        hero_url: initial?.hero_url || "",
        meta_title: initial?.meta_title || "",
        meta_description: initial?.meta_description || "",
        lang: initial?.lang || "ru",
        category: initial?.category || "guides",
        status: initial?.status || "draft",
        published_at: initial?.published_at ? initial.published_at.slice(0,16) : "",
    }));

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        // преобразуем published_at из локальной строки в ISO, если есть
        payload.published_at = form.published_at ? new Date(form.published_at).toISOString() : null;
        onSave(payload);
    };

    return (
        <form onSubmit={submit} className="space-y-4 text-white">
            <h2 className="text-xl font-semibold">{initial ? "Редактировать статью" : "Новая статья"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <div className="mb-1">Заголовок</div>
                    <input name="title" value={form.title} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" required />
                </label>
                <label className="block">
                    <div className="mb-1">Слаг</div>
                    <input name="slug" value={form.slug} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" required />
                </label>
                <label className="block">
                    <div className="mb-1">Категория</div>
                    <select name="category" value={form.category} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2">
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </label>
                <label className="block">
                    <div className="mb-1">Статус</div>
                    <select name="status" value={form.status} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2">
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </label>
            </div>

            <label className="block">
                <div className="mb-1">Краткое описание</div>
                <textarea name="summary" value={form.summary} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" rows={2} />
            </label>

            <label className="block">
                <div className="mb-1">Hero URL</div>
                <input name="hero_url" value={form.hero_url} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" placeholder="https://cdn.posttrack.app/..." />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <div className="mb-1">Meta title</div>
                    <input name="meta_title" value={form.meta_title} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" />
                </label>
                <label className="block">
                    <div className="mb-1">Meta description</div>
                    <input name="meta_description" value={form.meta_description} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" />
                </label>
            </div>

            <label className="block">
                <div className="mb-1">Дата публикации</div>
                <input type="datetime-local" name="published_at" value={form.published_at} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2" />
            </label>

            <label className="block">
                <div className="mb-1">Текст (Markdown)</div>
                <textarea name="body_md" value={form.body_md} onChange={onChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 font-mono" rows={12} />
            </label>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Отмена</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">{initial ? "Сохранить" : "Создать"}</button>
            </div>
        </form>
    );
}
