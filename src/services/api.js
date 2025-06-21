export const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include", // ВАЖНО: отправка cookie
    });

    if (res.status === 401) throw new Error("Unauthorized");
    return res.json();
};

export const getClients = async () => {
    return await apiFetch("http://localhost:8000/api/clients");
};

export const fetchDashboardSummary = async (start, end) => {
    const url = `http://localhost:8000/api/dashboard/summary?start_date=${start}&end_date=${end}`;
    return await apiFetch(url);
};

export const createClient = async (clientData) => {
    return await apiFetch("http://localhost:8000/api/clients", {
        method: "POST",
        body: JSON.stringify(clientData),
    });
};

export const updateClient = async (id, clientData) => {
    return await apiFetch(`http://localhost:8000/api/clients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(clientData),
    });
};

export const getPayments = async () => {
    return await apiFetch("http://localhost:8000/api/payments");
};

export const createPayment = async (data) => {
    return await apiFetch("http://localhost:8000/api/payments", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updatePayment = async (id, data) => {
    return await apiFetch(`http://localhost:8000/api/payments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const getExpenses = async () => {
    return await apiFetch("http://localhost:8000/api/expenses");
};

export const createExpense = async (expenseData) => {
    return await apiFetch("http://localhost:8000/api/expenses", {
        method: "POST",
        body: JSON.stringify(expenseData),
    });
};

export const deleteExpense = async (id) => {
    return await apiFetch(`http://localhost:8000/api/expenses/${id}`, {
        method: "DELETE",
    });
};
