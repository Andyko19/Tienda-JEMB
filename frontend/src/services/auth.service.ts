import api from "./api";

// Definimos qué datos esperamos recibir al registrar un usuario (igual que en tu Backend)
export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Función para registrar
  register: async (data: RegisterData) => {
    // Esto enviará un POST a http://localhost:3001/api/auth/register
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Función para iniciar sesión
  login: async (data: LoginData) => {
    // Esto enviará un POST a http://localhost:3001/api/auth/login
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};
