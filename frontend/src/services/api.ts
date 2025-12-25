import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Antes de cada petición, inyectamos el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si hay token, lo agregamos al header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
