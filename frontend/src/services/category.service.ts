import api from "./api";

export interface Category {
  id: string;
  name: string;
}

export const categoryService = {
  // 1. Obtener todas (Público)
  getAll: async () => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  // 2. Crear una (Privado)
  create: async (name: string) => {
    const response = await api.post<Category>("/categories", { name });
    return response.data;
  },

  // 3. Actualizar una (Privado) -> ¡ESTA ERA LA QUE FALTABA!
  update: async (id: string, name: string) => {
    const response = await api.put<Category>(`/categories/${id}`, { name });
    return response.data;
  },

  // 4. Borrar una (Privado)
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
