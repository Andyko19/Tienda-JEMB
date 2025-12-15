import api from "./api";

// Definimos la estructura de un Producto (coincide con tu backend)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // A veces el backend envía decimales como strings
  stock: number;
  categoryId: string;
  Category?: {
    // El backend incluye esto gracias al "include"
    name: string;
  };
}

// Datos necesarios para crear un producto
export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export const productService = {
  getAll: async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  create: async (data: CreateProductData) => {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
