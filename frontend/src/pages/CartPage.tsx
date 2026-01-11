import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { orderService } from "../services/order.service";
import { useAuth } from "../context/AuthContext";

// 🔴 TU NÚMERO DE WHATSAPP (Asegúrate de ponerlo con código de país)
const OWNER_PHONE = "593969049296";

export const CartPage = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  // --- NUEVOS ESTADOS ---
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // 1. PRIMER PASO: Validar usuario, datos y crear orden
  const handleInitiatePurchase = async () => {
    // A. Validar Autenticación (TU CÓDIGO)
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar una compra.");
      navigate("/login");
      return;
    }

    // B. Validar Carrito
    if (cart.length === 0) return;

    // C. Validar Datos de Envío (NUEVO)
    if (!customerName || !address || !city || !phone) {
      alert(
        "⚠️ Por favor, completa todos los datos de envío antes de continuar."
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Preparar datos para el backend
      const itemsToBuy = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // 2. Crear orden en Backend
      const orderData = await orderService.create(itemsToBuy);

      // 3. ¡ÉXITO! Guardamos ID y mostramos el Modal QR
      setOrderId(orderData.orderId); // Asumo que tu backend devuelve { orderId: "..." }
      setShowPaymentModal(true);
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

  // 2. SEGUNDO PASO: Generar mensaje de WhatsApp y finalizar
  const handleFinalizePurchase = () => {
    if (!orderId) return;

    // --- CONSTRUCCIÓN DEL MENSAJE DE WHATSAPP ---
    let message = `Hola! 👋 Este es el pedido, *#${orderId}*.\n`;
    message += `En un momento adjunto mi comprobante de pago 📄.\n\n`;

    // Datos de Envío
    message += `📦 *DATOS DE ENVÍO:*\n`;
    message += `👤 Cliente: ${customerName}\n`;
    message += `📞 Teléfono: ${phone}\n`;
    message += `🏙️ Ciudad: ${city}\n`;
    message += `🏠 Dirección: ${address}\n\n`;

    // Detalle de Productos
    message += `🛒 *DETALLE DE LA COMPRA:*\n`;
    cart.forEach((item) => {
      message += `- *${item.quantity}x* ${item.name} ($${Number(
        item.price
      ).toFixed(2)})\n`;
    });

    // Total
    message += `\n💰 *TOTAL PAGADO: $${total.toFixed(2)}*`;

    // --- ACCIÓN ---
    const whatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank"); // Abrir WhatsApp

    // Limpieza final (TU LÓGICA)
    clearCart();
    setShowPaymentModal(false);
    navigate("/"); // Redirigir al home
  };

  // --- RENDERIZADO SI EL CARRITO ESTÁ VACÍO ---
  if (cart.length === 0 && !showPaymentModal) {
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
      <h2>Tu Carrito de Compras 🛒</h2>

      {/* --- LISTA DE PRODUCTOS (TU CÓDIGO) --- */}
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
          borderTop: "2px solid #666",
          paddingTop: "1rem",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#4caf50", textAlign: "right" }}>
          Total: ${total.toFixed(2)}
        </h2>

        {/* --- NUEVO: FORMULARIO DE ENVÍO --- */}
        <div
          style={{
            background: "#2a2a2a",
            padding: "1.5rem",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "1px solid #444",
          }}
        >
          <h3 style={{ color: "#4caf50", marginTop: 0 }}>
            📍 Datos para el Envío
          </h3>
          <p
            style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "1rem" }}
          >
            Ingresa tus datos para coordinar la entrega. (Servientrega/Ecuador)
          </p>

          <div style={{ display: "grid", gap: "1rem" }}>
            <input
              placeholder="Nombre Completo"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ padding: "0.5rem", width: "100%" }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                placeholder="Celular"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ padding: "0.25rem", width: "100%" }}
              />
              <input
                placeholder="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ padding: "0.25rem", width: "100%" }}
              />
            </div>
            <textarea
              placeholder="Dirección exacta (Calle, número, referencia)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", height: "80px" }}
            />
          </div>
        </div>
        {/* --- FIN FORMULARIO --- */}

        {/* --- BOTONES DE ACCIÓN --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "2rem",
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
            onClick={handleInitiatePurchase}
            disabled={isProcessing}
            style={{
              padding: "0.8rem 2rem",
              background: isProcessing ? "#555" : "#646cff",
              border: "none",
              color: "white",
              fontWeight: "bold",
              borderRadius: "4px",
              cursor: isProcessing ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
            }}
          >
            {isProcessing ? "Procesando..." : "Continuar al Pago ➡️"}
          </button>
        </div>
      </div>

      {/* --- MODAL DE PAGO (QR) --- */}
      {showPaymentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "90%",
              width: "450px",
              textAlign: "center",
              border: "1px solid #444",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ color: "#4caf50", marginTop: 0 }}>
              ¡Confirma tu Pago! 💸
            </h2>
            <p>
              Orden <strong>#{orderId}</strong> generada.
            </p>
            <p>
              Escanea para pagar <strong>${total.toFixed(2)}</strong>:
            </p>

            <div
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "8px",
                display: "inline-block",
                margin: "1rem 0",
              }}
            >
              {/* IMPORTANTE: Pon tu imagen 'qr-banco.jpg' en la carpeta public/ */}
              <img
                src="/qr-banco.jpeg"
                alt="QR Banco"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                textAlign: "left",
                background: "#333",
                padding: "1rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
                color: "#ddd",
              }}
            >
              <p style={{ margin: "0.2rem 0" }}>
                🏦 <strong>Banco:</strong> Pichincha
              </p>
              <p style={{ margin: "0.2rem 0" }}>
                👤 <strong>Titular:</strong> Johanna Moreira
              </p>
              <p style={{ margin: "0.2rem 0" }}>
                💳 <strong>Cuenta:</strong> 2211770275
              </p>
            </div>

            <button
              onClick={handleFinalizePurchase}
              style={{
                width: "100%",
                padding: "1rem",
                background: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              ✅ Enviar Pedido y proceder a pagar
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                background: "transparent",
                color: "#aaa",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
