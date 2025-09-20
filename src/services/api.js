import { API_BASE_URL, mediaUrl } from "../config";

// Универсальный fetch с авторизацией и JSON-обработкой
export const apiFetch = async (url, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include",
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (res.status === 204) return null;

    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Ошибка при запросе");
    return data;
};

// ========== Clients ==========
export const getClients = () => apiFetch("/clients");
export const createClient = (clientData) =>
    apiFetch("/clients", { method: "POST", body: JSON.stringify(clientData) });
export const updateClient = (id, clientData) =>
    apiFetch(`/clients/${id}`, { method: "PATCH", body: JSON.stringify(clientData) });

// ========== Dashboard ==========
export const fetchDashboardSummary = (start, end) =>
    apiFetch(`/dashboard/summary?start_date=${start}&end_date=${end}`);

// ========== Payments ==========
export const getPayments = () => apiFetch("/payments");
export const createPayment = (data) =>
    apiFetch("/payments", { method: "POST", body: JSON.stringify(data) });
export const updatePayment = (id, data) =>
    apiFetch(`/payments/${id}`, { method: "PUT", body: JSON.stringify(data) });

// ========== Expenses ==========
export const getExpenses = () => apiFetch("/expenses");
export const createExpense = (expenseData) =>
    apiFetch("/expenses", { method: "POST", body: JSON.stringify(expenseData) });
export const deleteExpense = (id) =>
    apiFetch(`/expenses/${id}`, { method: "DELETE" });

// ========== Leads / Tariffs ==========
export const getLeadRequests = () => apiFetch("/lead-requests");
export const getTariffs = () => apiFetch("/tariffs");
export const createTariff = (data) =>
    apiFetch("/tariffs", { method: "POST", body: JSON.stringify(data) });
export const updateTariff = (id, data) =>
    apiFetch(`/tariffs/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTariff = (id) =>
    apiFetch(`/tariffs/${id}`, { method: "DELETE" });

export const provisionClient = (slug) =>
    apiFetch(`/clients/${slug}/provision`, { method: "POST" });
export const deprovisionClient = (slug) =>
    apiFetch(`/clients/${slug}/deprovision`, { method: "POST" });

// ========== Blog (Admin) ==========
export const adminListPosts = (params = {}) => {
    const sp = new URLSearchParams();
    if (params.limit != null)  sp.set("limit", String(params.limit));
    if (params.offset != null) sp.set("offset", String(params.offset));
    if (params.q)              sp.set("q", params.q);
    if (params.category)       sp.set("category", params.category);
    if (params.status)         sp.set("status", params.status);
    const qs = sp.toString();
    return apiFetch(`/blog/admin/list${qs ? `?${qs}` : ""}`);
};

export const getBlogPost = (slug) => apiFetch(`/blog/${slug}`);
export const adminCreatePost = (payload) =>
    apiFetch(`/blog`, { method: "POST", body: JSON.stringify(payload) });
export const adminUpdatePost = (id, payload) =>
    apiFetch(`/blog/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const adminDeletePost = (id) =>
    apiFetch(`/blog/${id}`, { method: "DELETE" });

// ========== Media ==========
export const uploadMedia = async (file, alt = "") => {
    const form = new FormData();
    form.append("file", file);
    if (alt) form.append("alt", alt);

    const res = await fetch(`${API_BASE_URL}/media/upload`, {
        method: "POST",
        body: form,
        credentials: "include",
    });

    if (!res.ok) {
        let msg = "Upload failed";
        try { const data = await res.json(); msg = data?.detail || msg; } catch {}
        throw new Error(msg);
    }
    const m = await res.json();
    return { ...m, url: mediaUrl(m.url || m.stored_name) };
};

export const listMedia = async (params = {}) => {
    const sp = new URLSearchParams();
    if (params.limit != null)  sp.set("limit", String(params.limit));
    if (params.offset != null) sp.set("offset", String(params.offset));
    const qs = sp.toString();

    const items = await apiFetch(`/media${qs ? `?${qs}` : ""}`);
    return items.map((m) => ({
        ...m,
        url: mediaUrl(m.url || m.stored_name),
    }));
};

export const deleteMedia = (id) =>
    apiFetch(`/media/${id}`, { method: "DELETE" });
