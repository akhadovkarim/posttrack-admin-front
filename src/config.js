export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// origin API (без /api)
let API_ORIGIN = "";
try { API_ORIGIN = new URL(API_BASE_URL).origin; } catch { API_ORIGIN = ""; }

// Где лежат медиа (origin или CDN)
export const MEDIA_BASE_URL =
    (import.meta.env.VITE_MEDIA_BASE_URL || API_ORIGIN).replace(/\/$/, "");

// Нормализатор ссылок для медиа
export const mediaUrl = (pathOrUrl) => {
    if (!pathOrUrl) return "";
    const s = String(pathOrUrl);
    if (/^https?:\/\//i.test(s)) return s;            // уже абсолютный
    if (s.startsWith("/media/")) return `${MEDIA_BASE_URL}${s}`;
    if (s.startsWith("/"))       return `${MEDIA_BASE_URL}/media${s}`;
    return `${MEDIA_BASE_URL}/media/${s}`;
};
