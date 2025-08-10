import React, { useState, useEffect } from "react";
import { getTariffs } from "../services/api";

const ALLOWED_SIDEPANELS = [
    "dashboard",
    "expenses",
    "reports",
    "team",
    "notifications",
    "cards",
    "creatives",
    "chatterfy",
    "chatterfy_stats",
    "finance",
    "stats",
];

const bool = (v) => v === true || v === "true";

const ClientForm = ({ initialData = null, onSave, onCancel }) => {
    const [tariffs, setTariffs] = useState([]);

    const [formData, setFormData] = useState({
        slug: "",
        company_name: "",
        domain: "",
        api_domain: "",
        contact: "",
        telegram_chat_id: "",
        tariff: "",
        status: "trial",
        expires_at: "",
        custom_price: "",
        custom_period_days: "",
    });

    const [branding, setBranding] = useState({
        logoUrl: "",
        primary: "#1E88E5",
        accent: "#00C853",
    });
    const [features, setFeatures] = useState({
        finance: false,
        stats: false,
        chatterfy: false,
        brocards: false,
    });
    const [sidepanels, setSidepanels] = useState(["dashboard"]);
    const [metricsText, setMetricsText] = useState('{"chatterfy": []}');

    useEffect(() => {
        (async () => {
            try {
                const data = await getTariffs();
                setTariffs(data);
            } catch (e) {
                console.error("Ошибка загрузки тарифов", e);
            }
        })();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                slug: initialData.slug || "",
                id: initialData.id || "",
                company_name: initialData.company_name || "",
                domain: initialData.domain || "",
                api_domain: initialData.api_domain || "",
                contact: initialData.contact || "",
                telegram_chat_id: initialData.telegram_chat_id?.toString() || "",
                tariff: initialData.tariff || "",
                status: initialData.status || "trial",
                expires_at: initialData.expires_at
                    ? initialData.expires_at.slice(0, 16)
                    : "",
                custom_price: initialData.custom_price?.toString() || "",
                custom_period_days: initialData.custom_period_days?.toString() || "",
            });
            setBranding({
                logoUrl: initialData.branding?.logoUrl || "",
                primary: initialData.branding?.primary || "#1E88E5",
                accent: initialData.branding?.accent || "#00C853",
            });
            setFeatures({
                finance: bool(initialData.features?.finance),
                stats: bool(initialData.features?.stats),
                chatterfy: bool(initialData.features?.chatterfy),
                brocards: bool(initialData.features?.brocards),
            });
            setSidepanels(
                Array.isArray(initialData.sidepanels) && initialData.sidepanels.length
                    ? initialData.sidepanels
                    : ["dashboard"]
            );
            setMetricsText(
                JSON.stringify(initialData.metrics || { chatterfy: [] }, null, 2)
            );
        } else {
            setFormData((p) => ({ ...p, id: "", tariff: "", status: "trial" }));
            setBranding({ logoUrl: "", primary: "#1E88E5", accent: "#00C853" });
            setFeatures({
                finance: false,
                stats: false,
                chatterfy: false,
                brocards: false,
            });
            setSidepanels(["dashboard"]);
            setMetricsText('{"chatterfy": []}');
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleFeature = (key) => {
        setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const togglePanel = (panel) => {
        setSidepanels((prev) =>
            prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let metrics;
        try {
            metrics = JSON.parse(metricsText || "{}");
            if (typeof metrics !== "object" || Array.isArray(metrics))
                throw new Error();
        } catch {
            alert("Поле METRICS должно быть корректным JSON-объектом");
            return;
        }

        const payload = {
            ...formData,
            slug: formData.slug.trim(),
            telegram_chat_id: formData.telegram_chat_id
                ? parseInt(formData.telegram_chat_id, 10)
                : null,
            custom_price:
                formData.custom_price !== "" ? parseFloat(formData.custom_price) : null,
            custom_period_days:
                formData.custom_period_days !== ""
                    ? parseInt(formData.custom_period_days, 10)
                    : null,
            branding: {
                logoUrl: branding.logoUrl?.trim() || "",
                primary: branding.primary || "#1E88E5",
                accent: branding.accent || "#00C853",
            },
            features: {
                finance: !!features.finance,
                stats: !!features.stats,
                chatterfy: !!features.chatterfy,
                brocards: !!features.brocards,
            },
            sidepanels: sidepanels,
            metrics,
        };

        onSave(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-white"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">ID </label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        disabled={!!initialData}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        disabled={!!initialData} // нельзя менять при редактировании
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Компания</label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">WEB‑домен</label>
                    <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        placeholder="demo.posttrack.app"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">API‑домен</label>
                    <input
                        type="text"
                        name="api_domain"
                        value={formData.api_domain}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        placeholder="demo-api.posttrack.app"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Контакт</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Telegram Chat ID</label>
                    <input
                        type="text"
                        name="telegram_chat_id"
                        value={formData.telegram_chat_id}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Тариф</label>
                    <select
                        name="tariff"
                        value={formData.tariff}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        required
                    >
                        <option value="">Выберите тариф</option>
                        {tariffs.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name} — {t.price || 0}$
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1">Статус</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    >
                        <option value="trial">Trial</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="blocked">Blocked</option>
                        <option value="provisioning">Provisioning</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1">Истекает</label>
                    <input
                        type="datetime-local"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Индивид. цена (USD)</label>
                    <input
                        type="number"
                        name="custom_price"
                        value={formData.custom_price}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        step="0.01"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Индивид. период (дней)</label>
                    <input
                        type="number"
                        name="custom_period_days"
                        value={formData.custom_period_days}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        min="1"
                    />
                </div>
            </div>

            <details open className="border-t border-gray-700 pt-4">
                <summary className="cursor-pointer select-none font-semibold mb-2">
                    Branding
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Logo URL</label>
                        <input
                            type="text"
                            value={branding.logoUrl}
                            onChange={(e) =>
                                setBranding((p) => ({ ...p, logoUrl: e.target.value }))
                            }
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Primary</label>
                        <input
                            type="text"
                            value={branding.primary}
                            onChange={(e) =>
                                setBranding((p) => ({ ...p, primary: e.target.value }))
                            }
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Accent</label>
                        <input
                            type="text"
                            value={branding.accent}
                            onChange={(e) =>
                                setBranding((p) => ({ ...p, accent: e.target.value }))
                            }
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        />
                    </div>
                </div>
            </details>

            <details open className="border-t border-gray-700 pt-4">
                <summary className="cursor-pointer select-none font-semibold mb-2">
                    Features
                </summary>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["finance", "stats", "chatterfy", "brocards"].map((k) => (
                        <label key={k} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={!!features[k]}
                                onChange={() => toggleFeature(k)}
                            />
                            <span>{k}</span>
                        </label>
                    ))}
                </div>
            </details>

            <details className="border-t border-gray-700 pt-4">
                <summary className="cursor-pointer select-none font-semibold mb-2">
                    Sidepanels
                </summary>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ALLOWED_SIDEPANELS.map((p) => (
                        <label key={p} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={sidepanels.includes(p)}
                                onChange={() => togglePanel(p)}
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
            </details>

            <details className="border-t border-gray-700 pt-4">
                <summary className="cursor-pointer select-none font-semibold mb-2">
                    Metrics (JSON)
                </summary>
                <textarea
                    rows={8}
                    value={metricsText}
                    onChange={(e) => setMetricsText(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded font-mono text-sm"
                    placeholder='{"chatterfy":[{"key":"FD","label":"FD","align":"right","isMoney":true}]}'
                />
            </details>

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

export default ClientForm;
