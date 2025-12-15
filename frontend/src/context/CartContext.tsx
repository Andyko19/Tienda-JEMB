import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type { Product } from "../services/product.service";

// Definimos cómo se ve un ítem en el carrito (Producto + Cantidad)
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
  count: number; // Cantidad total de ítems (para el globito del icono)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Función para añadir producto
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // 1. Buscamos si el producto ya está en el carrito
      const itemExists = prevCart.find((item) => item.id === product.id);

      if (itemExists) {
        // 2. Si existe, le sumamos 1 a la cantidad
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 3. Si no existe, lo agregamos con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Función para eliminar un producto completo del carrito
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Función para vaciar todo
  const clearCart = () => {
    setCart([]);
  };

  // Calcular el precio total
  const total = cart.reduce((sum, item) => {
    // Aseguramos que el precio sea número (a veces viene como string desde la BD)
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return sum + price * item.quantity;
  }, 0);

  // Calcular cantidad total de artículos
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};
