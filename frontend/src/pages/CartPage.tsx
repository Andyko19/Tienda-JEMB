import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { orderService } from "../services/order.service"; // <--- Importar servicio
import { useAuth } from "../context/AuthContext"; // <--- Para verificar si está logueado

export const CartPage = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); // Para deshabilitar botón mientras carga

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar una compra.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Preparamos los datos como los quiere el backend (solo id y cantidad)
      const itemsToBuy = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // 2. Enviamos la orden
      await orderService.create(itemsToBuy);

      // 3. Éxito: Limpiamos carrito y avisamos
      clearCart();
      alert("¡Compra realizada con éxito! 🚀 Gracias por tu preferencia.");
      navigate("/"); // Redirigir al inicio (o a una página de historial de órdenes si tuviéramos)
    } catch (error: any) {
      console.error("Error en la compra:", error);
      alert(
        error.response?.data?.message ||
          "Ocurrió un error al procesar la compra."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2>Tu carrito está vacío 😢</h2>
        <p>¡Ve a buscar algo interesante!</p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#646cff",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>Tu Carrito de Compras</h2>

      <div style={{ marginTop: "2rem" }}>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #444",
              padding: "1rem 0",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{item.name}</h3>
              <p style={{ color: "#aaa", margin: "0.2rem 0" }}>
                Precio unitario: ${Number(item.price).toFixed(2)}
              </p>
              <p style={{ fontWeight: "bold" }}>Cantidad: {item.quantity}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "2rem",
          textAlign: "right",
          borderTop: "2px solid #666",
          paddingTop: "1rem",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#4caf50" }}>
          Total: ${total.toFixed(2)}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={clearCart}
            disabled={isProcessing}
            style={{
              padding: "0.8rem 1.5rem",
              background: "transparent",
              border: "1px solid #aaa",
              color: "#aaa",
              borderRadius: "4px",
              cursor: isProcessing ? "not-allowed" : "pointer",
            }}
          >
            Vaciar Carrito
          </button>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            style={{
              padding: "0.8rem 2rem",
              background: isProcessing ? "#555" : "#4caf50",
              border: "none",
              color: "white",
              fontWeight: "bold",
              borderRadius: "4px",
              cursor: isProcessing ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
            }}
          >
            {isProcessing ? "Procesando..." : "Finalizar Compra"}
          </button>
        </div>
      </div>
    </div>
  );
};
