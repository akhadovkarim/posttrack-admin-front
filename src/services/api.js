import { API_BASE_URL } from "../config";

// Универсальный fetch с авторизацией и JSON-обработкой
export const apiFetch = async (url, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include", // важно для cookie
    });

    if (res.status === 401) throw new Error("Unauthorized");

    // Если пустой ответ (204 No Content)
    if (res.status === 204) return null;

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.detail || "Ошибка при запросе");
    }

    return data;
};

// ========== Clients ==========
export const getClients = () => apiFetch("/clients");

export const createClient = (clientData) =>
    apiFetch("/clients", {
        method: "POST",
        body: JSON.stringify(clientData),
    });

export const updateClient = (id, clientData) =>
    apiFetch(`/clients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(clientData),
    });

// ========== Dashboard ==========
export const fetchDashboardSummary = (start, end) =>
    apiFetch(`/dashboard/summary?start_date=${start}&end_date=${end}`);

// ========== Payments ==========
export const getPayments = () => apiFetch("/payments");

export const createPayment = (data) =>
    apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updatePayment = (id, data) =>
    apiFetch(`/payments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

// ========== Expenses ==========
export const getExpenses = () => apiFetch("/expenses");

export const createExpense = (expenseData) =>
    apiFetch("/expenses", {
        method: "POST",
        body: JSON.stringify(expenseData),
    });

export const deleteExpense = (id) =>
    apiFetch(`/expenses/${id}`, {
        method: "DELETE",
    });

export const getLeadRequests = () => apiFetch("/lead-requests");

export const getTariffs = () => apiFetch("/tariffs");

export const createTariff = (data) =>
    apiFetch("/tariffs", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateTariff = (id, data) =>
    apiFetch(`/tariffs/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteTariff = (id) =>
    apiFetch(`/tariffs/${id}`, {
        method: "DELETE",
    });

export const provisionClient = (slug) =>
    apiFetch(`/clients/${slug}/provision`, { method: "POST" });

export const deprovisionClient = (slug) =>
    apiFetch(`/clients/${slug}/deprovision`, { method: "POST" });


export const getBlogPosts = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/blog${qs ? `?${qs}` : ""}`);
};

export const getBlogPost = (slug) => apiFetch(`/blog/${slug}`);

export const adminCreatePost = (payload) =>
    apiFetch(`/blog`, { method: "POST", body: JSON.stringify(payload) });

export const adminUpdatePost = (id, payload) =>
    apiFetch(`/blog/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const adminDeletePost = (id) =>
    apiFetch(`/blog/${id}`, { method: "DELETE" });
