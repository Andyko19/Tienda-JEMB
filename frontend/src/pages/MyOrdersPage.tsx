import { useEffect, useState } from "react";
import { orderService } from "../services/order.service";
import type { Order } from "../services/order.service";

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error al cargar órdenes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando historial...
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>Mis Compras</h2>

      {orders.length === 0 ? (
        <p>No has realizado ninguna compra todavía.</p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "1.5rem",
                background: "#2a2a2a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #555",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <span style={{ color: "#aaa", fontSize: "0.9rem" }}>
                    Fecha:
                  </span>
                  <div style={{ fontWeight: "bold" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#aaa", fontSize: "0.9rem" }}>
                    Total:
                  </span>
                  <div
                    style={{
                      color: "#4caf50",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    ${Number(order.total).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Lista de productos en esta orden */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {order.OrderItems.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>
                      {item.quantity} x{" "}
                      {item.Product
                        ? item.Product.name
                        : "Producto desconocido"}
                    </span>
                    <span>${Number(item.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
