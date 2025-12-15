import api from "./api";

export interface Category {
  id: string;
  name: string;
}

export const categoryService = {
  // Obtener todas (Público)
  getAll: async () => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  // Crear una (Privado - Requiere Token, el interceptor se encarga)
  create: async (name: string) => {
    const response = await api.post<Category>("/categories", { name });
    return response.data;
  },

  // Borrar una (Privado)
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
