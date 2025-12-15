import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import type { Product } from "../services/product.service";
import { useCart } from "../context/CartContext";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando catálogo...
      </div>
    );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2.5rem",
        }}
      >
        Nuestros Productos
      </h1>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No hay productos disponibles por el momento.
        </p>
      ) : (
        /* GRID DE PRODUCTOS */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                background: "#2a2a2a",
                transition: "transform 0.2s",
              }}
            >
              {/* Imagen simulada (placeholder) */}
              <div
                style={{
                  height: "150px",
                  background: "#555",
                  marginBottom: "1rem",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                }}
              >
                Sin Imagen
              </div>

              <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>

              <p
                style={{
                  color: "#aaa",
                  fontSize: "0.9rem",
                  flex: 1 /* Esto empuja el precio hacia abajo */,
                  marginBottom: "1rem",
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#4caf50",
                  }}
                >
                  ${product.price}
                </span>

                <button
                  onClick={() => {
                    addToCart(product);
                    alert("Producto agregado al carrito 🛒");
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#646cff",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
