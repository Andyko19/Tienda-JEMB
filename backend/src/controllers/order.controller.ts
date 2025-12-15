import type { Request } from "express";
import type { Response } from "express";
import Order from "../database/models/order.model.js";
import OrderItem from "../database/models/orderItem.model.js";
import Product from "../database/models/product.model.js";

// Interfaz local para ayudar a TypeScript con el objeto temporal
interface ProductToBuy {
  product: Product;
  quantity: number;
  price: number;
}

export const createOrder = async (req: Request, res: Response) => {
  // @ts-ignore (Ignoramos el error de TS aquí porque sabemos que el middleware pone el usuario)
  const userId = req.user?.id;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "El carrito está vacío." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado." });
  }

  try {
    let total = 0;
    const productsToBuy: ProductToBuy[] = []; // Usamos la interfaz para asegurar la estructura

    // 1. Validar productos, stock y calcular total
    for (const item of items) {
      const product = await Product.findByPk(item.id);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto con ID ${item.id} no encontrado.` });
      }

      // Convertir precio a número por seguridad
      const price =
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price;

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Stock insuficiente para ${product.name}.` });
      }

      total += price * item.quantity;

      // ¡IMPORTANTE! Aquí guardamos el precio explícitamente para usarlo luego
      productsToBuy.push({
        product,
        quantity: item.quantity,
        price: price, // Guardamos el precio individual
      });
    }

    console.log("Creando orden para usuario:", userId, "Total:", total);

    // 2. Crear la Orden (Cabecera)
    const newOrder = await Order.create({
      userId,
      total,
    });

    console.log("Orden creada con ID:", newOrder.id);

    // 3. Crear los Detalles (Items)
    // Usamos Promise.all para que sea más rápido y seguro
    await Promise.all(
      productsToBuy.map(async (p) => {
        await OrderItem.create({
          orderId: newOrder.id, // ID de la orden recién creada
          productId: p.product.id, // ID del producto
          quantity: p.quantity,
          price: p.price, // Precio guardado en el paso 1
        });

        // Restar stock
        await p.product.update({ stock: p.product.stock - p.quantity });
      })
    );

    res
      .status(201)
      .json({ message: "Compra realizada con éxito", orderId: newOrder.id });
  } catch (error) {
    console.error("Error detallado al crear la orden:", error); // Log más detallado
    res.status(500).json({ message: "Error interno al procesar la compra." });
  }
};
export const getOrdersByUser = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name", "price"], // Solo nos interesa el nombre y precio actual
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]], // Las más recientes primero
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error al obtener el historial." });
  }
};
