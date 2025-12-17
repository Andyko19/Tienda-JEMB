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
              {/* ZONA DE IMAGEN */}
              <div
                style={{
                  height: "200px",
                  marginBottom: "1rem",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                }}
              >
                {product.image ? (
                  <img
                    // Corrección para rutas de Windows (\ -> /)
                    src={`http://localhost:3001/${product.image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "Sin Imagen"
                )}
              </div>

              <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>

              <p
                style={{
                  color: "#aaa",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  flex: 1,
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
