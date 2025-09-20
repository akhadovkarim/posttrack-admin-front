import { useEffect, useMemo, useRef, useState } from "react";
import { uploadMedia, listMedia } from "../services/api";

function slugify(input) {
    const map = {
        а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",
        к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
        х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ы:"y",э:"e",ю:"yu",я:"ya",
        ъ:"",ь:""
    };
    return (input || "")
        .toString()
        .trim()
        .toLowerCase()
        .split("")
        .map(ch => map[ch] ?? ch)
        .join("")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 180);
}

// Простая оценка времени чтения
function readingTime(text) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return { words, minutes };
}

// Лёгкий Markdown-превью без зависимостей (минимум: заголовки, жирный, курсив, код-блоки, ссылки)
// Для production лучше подключить ваш рендер с сервера. Здесь — предпросмотр в админке.
function renderMarkdown(md) {
    let html = (md || "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+?)`/gim, "<code>$1</code>")
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" loading="lazy"/>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\n{2,}/g, "</p><p>")
        .replace(/^\s*$/gim, "");
    return `<p>${html}</p>`;
}

const TABS = ["Контент", "SEO", "Медиа", "Настройки"];

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
    const [tab, setTab] = useState(TABS[0]);
    const [uploading, setUploading] = useState(false);
    const [mediaOpen, setMediaOpen] = useState(false);
    const slugTouchedRef = useRef(Boolean(initial?.slug));

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

    // авто-генерация slug при изменении title, если slug не трогали руками
    useEffect(() => {
        if (!slugTouchedRef.current) {
            setForm((s) => ({ ...s, slug: slugify(s.title) }));
        }
    }, [form.title]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onSlugChange = (e) => {
        slugTouchedRef.current = true;
        setForm((s) => ({ ...s, slug: slugify(e.target.value) }));
    };

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.published_at = form.published_at ? new Date(form.published_at).toISOString() : null;
        if (!payload.slug) payload.slug = slugify(payload.title);
        onSave(payload);
    };

    const { words, minutes } = useMemo(() => readingTime(form.body_md || ""), [form.body_md]);

    const onHeroSelect = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        try {
            setUploading(true);
            const m = await uploadMedia(f);
            setForm((s) => ({ ...s, hero_url: m.url }));
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const insertImageToMarkdown = async (file) => {
        try {
            setUploading(true);
            const m = await uploadMedia(file);
            setForm((s) => ({
                ...s,
                body_md: (s.body_md || "") + `\n\n![${m.alt || ""}](${m.url})\n\n`,
            }));
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {TABS.map((t) => {
                    const active = tab === t;
                    return (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={
                                "px-4 py-2 rounded-full text-sm border transition " +
                                (active
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-gray-900 border-gray-700 text-gray-200 hover:border-gray-600")
                            }
                        >
                            {t}
                        </button>
                    );
                })}
            </div>

            {/* Контент */}
            {tab === "Контент" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="space-y-4">
                        <label className="block">
                            <div className="mb-1">Заголовок</div>
                            <input
                                name="title"
                                value={form.title}
                                onChange={onChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                required
                            />
                        </label>

                        <label className="block">
                            <div className="mb-1">Слаг</div>
                            <input
                                name="slug"
                                value={form.slug}
                                onChange={onSlugChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                placeholder="kak-nastroit-posttrack"
                                required
                            />
                        </label>

                        <label className="block">
                            <div className="mb-1">Краткое описание</div>
                            <textarea
                                name="summary"
                                value={form.summary}
                                onChange={onChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                rows={3}
                            />
                        </label>

                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <span>Текст (Markdown)</span>
                                <span className="text-xs text-gray-400">{words} слов · ~{minutes} мин.</span>
                            </div>
                            <textarea
                                name="body_md"
                                value={form.body_md}
                                onChange={onChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 font-mono"
                                rows={14}
                                placeholder="## Подзаголовок..."
                            />
                            <div className="mt-2 flex items-center gap-3">
                                <label className="bg-gray-800 hover:bg-gray-700 text-sm rounded px-3 py-1 cursor-pointer border border-gray-700">
                                    Вставить картинку
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && insertImageToMarkdown(e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setMediaOpen(true)}
                                    className="bg-gray-800 hover:bg-gray-700 text-sm rounded px-3 py-1 border border-gray-700"
                                >
                                    Открыть медиа
                                </button>
                                {uploading && <span className="text-xs text-gray-400">Загрузка…</span>}
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-950 border border-gray-800 rounded p-4 overflow-auto">
                        <div className="text-sm text-gray-400 mb-3">Предпросмотр</div>
                        <article
                            className="prose prose-invert max-w-none prose-headings:mt-4 prose-p:my-3 prose-img:rounded"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(form.body_md) }}
                        />
                    </div>
                </div>
            )}

            {/* SEO */}
            {tab === "SEO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="block">
                        <div className="mb-1">Meta title</div>
                        <input
                            name="meta_title"
                            value={form.meta_title}
                            onChange={onChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                            placeholder={form.title}
                        />
                    </label>
                    <label className="block">
                        <div className="mb-1">Meta description</div>
                        <input
                            name="meta_description"
                            value={form.meta_description}
                            onChange={onChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                            placeholder={form.summary}
                        />
                    </label>
                    <div className="md:col-span-2">
                        <div className="mb-1">Hero изображение</div>
                        <div className="flex items-center gap-3">
                            <input type="file" accept="image/*" onChange={onHeroSelect} />
                            <button
                                type="button"
                                onClick={() => setMediaOpen(true)}
                                className="bg-gray-800 hover:bg-gray-700 text-sm rounded px-3 py-1 border border-gray-700"
                            >
                                Выбрать из медиа
                            </button>
                            {uploading && <span className="text-xs text-gray-400">Загрузка…</span>}
                        </div>
                        {form.hero_url && (
                            <div className="mt-3">
                                <img src={form.hero_url} alt="" className="max-h-36 rounded border border-gray-700" />
                                <div className="text-xs text-gray-400 mt-1">{form.hero_url}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Медиа — откроется модалкой с галереей ниже */}
            {tab === "Медиа" && (
                <div className="text-gray-400">
                    Откройте «Медиа», чтобы выбрать/загрузить изображение и вставить в Markdown или указать как Hero.
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => setMediaOpen(true)}
                            className="bg-gray-800 hover:bg-gray-700 text-sm rounded px-3 py-2 border border-gray-700"
                        >
                            Открыть медиа-галерею
                        </button>
                    </div>
                </div>
            )}

            {/* Настройки */}
            {tab === "Настройки" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <label className="block">
                        <div className="mb-1">Категория</div>
                        <select
                            name="category"
                            value={form.category}
                            onChange={onChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <div className="mb-1">Статус</div>
                        <select
                            name="status"
                            value={form.status}
                            onChange={onChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                        >
                            {STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <div className="mb-1">Дата публикации</div>
                        <input
                            type="datetime-local"
                            name="published_at"
                            value={form.published_at}
                            onChange={onChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                        />
                    </label>
                </div>
            )}

            {/* Кнопки */}
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">
                    Отмена
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
                    {initial ? "Сохранить" : "Создать"}
                </button>
            </div>

            {/* Медиа-пикер */}
            {mediaOpen && (
                <MediaPicker
                    onClose={() => setMediaOpen(false)}
                    onChooseUrl={(url) => {
                        // Если открыт таб SEO — поставим как hero
                        if (tab === "SEO") {
                            setForm((s) => ({ ...s, hero_url: url }));
                        } else {
                            setForm((s) => ({ ...s, body_md: (s.body_md || "") + `\n\n![](${url})\n\n` }));
                        }
                        setMediaOpen(false);
                    }}
                    onUploadFile={insertImageToMarkdown}
                />
            )}
        </form>
    );
}

// ======== Медиа-галерея (простая) ========
function MediaPicker({ onClose, onChooseUrl, onUploadFile }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await listMedia({ limit: 100, offset: 0 });
            setItems(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                    <div className="font-semibold">Медиа</div>
                    <button onClick={onClose} className="text-gray-300 hover:text-white">✕</button>
                </div>
                <div className="p-4 flex items-center gap-3 border-b border-gray-800">
                    <label className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm cursor-pointer border border-gray-700">
                        Загрузить файл
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) onUploadFile(f);
                            }}
                            className="hidden"
                        />
                    </label>
                    <button onClick={load} className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm border border-gray-700">
                        Обновить
                    </button>
                </div>
                <div className="p-4 overflow-auto">
                    {loading ? (
                        <div className="text-gray-400">Загрузка…</div>
                    ) : items.length === 0 ? (
                        <div className="text-gray-400">Медиа нет</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {items.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => onChooseUrl(m.url)}
                                    className="group border border-gray-700 rounded overflow-hidden hover:border-gray-500"
                                    title={m.stored_name}
                                >
                                    <img src={m.url} alt="" className="w-full h-28 object-cover group-hover:opacity-90" />
                                    <div className="px-2 py-1 text-[10px] text-gray-400 text-left border-t border-gray-800">
                                        {(m.width && m.height) ? `${m.width}×${m.height}` : m.mime_type}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
