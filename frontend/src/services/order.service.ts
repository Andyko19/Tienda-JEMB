import api from "./api";

// Tipos para enviar una orden (lo que ya tenías)
export interface OrderItemPayload {
  id: string;
  quantity: number;
}

// Tipos para RECIBIR el historial (NUEVO)
export interface Order {
  id: string;
  total: string;
  createdAt: string;
  OrderItems: {
    id: string;
    quantity: number;
    price: string;
    Product: {
      name: string;
    };
  }[];
}

export const orderService = {
  // Crear orden
  create: async (items: OrderItemPayload[]) => {
    const response = await api.post("/orders", { items });
    return response.data;
  },

  // Obtener historial (NUEVO)
  getMyOrders: async () => {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  },
};
