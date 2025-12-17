import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  // ELIMINAMOS LA LÍNEA DE HEADERS FIJOS
  // Axios detectará automáticamente si enviamos JSON o Archivos
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
