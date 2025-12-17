import api from "./api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: string; // <--- Nuevo campo para la ruta de la imagen
  Category?: {
    name: string;
  };
}

export const productService = {
  getAll: async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  // MODIFICADO: Ahora recibe FormData (el paquete que soporta archivos)
  create: async (productData: FormData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
