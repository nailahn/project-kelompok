import axios from "axios";

/**
 * Axios instance terpusat.
 * Semua request ke backend menggunakan instance ini.
 */
const apiClient = axios.create({
    baseURL: "/api", // Menggunakan Vite proxy (lihat vite.config.js)
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 15000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Otomatis tambahkan Bearer token ke setiap request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────
// Tangani token expired (401) secara global
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired atau tidak valid — bersihkan storage & redirect login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

// ─── API Functions ─────────────────────────────────────────────────────────

// Auth
export const authAPI = {
    register: (data) => apiClient.post("/auth/register", data),
    login: (data) => apiClient.post("/auth/login", data),
    logout: () => apiClient.post("/auth/logout"),
    me: () => apiClient.get("/auth/me"),
};

// Genre
export const genreAPI = {
    getAll: () => apiClient.get("/genres"),
};

// Rekomendasi
export const recommendationAPI = {
    get: (params) => apiClient.get("/recommendations", { params }),
};

// Favorit
export const favoriteAPI = {
    getAll: () => apiClient.get("/favorites"),
    add: (data) => apiClient.post("/favorites", data),
    remove: (id) => apiClient.delete(`/favorites/${id}`),
};

// History
export const historyAPI = {
    getAll: () => apiClient.get("/history"),
};

// Movie Detail (endpoint baru — lihat bagian 14)
export const movieAPI = {
    getDetail: (movieId) => apiClient.get(`/movies/${movieId}`),
};

export default apiClient;
