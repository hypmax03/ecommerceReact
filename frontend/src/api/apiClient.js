import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL =
  rawBaseUrl && rawBaseUrl.trim() !== ""
    ? rawBaseUrl.trim().replace(/\/+$/, "")
    : "https://ecommercebk-1.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor: attach bearer token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically clean up stale token if 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized on authenticated routes
      if (localStorage.getItem("token") && error.config?.url?.includes("/api/user/profile")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
