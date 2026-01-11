import { useEffect, useState } from "react";
import type { Product } from "../services/product.service";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import type { Category } from "../services/category.service";
import { useCart } from "../context/CartContext";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { addToCart } = useCart();

  // URL base para las imágenes locales
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  const BASE_URL = API_URL.replace("/api", "");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll({
        name: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
      });
      setProducts(data);
    } catch (error) {
      console.error("Error filtrando:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);

  // --- COMPONENTE AUXILIAR PARA VIDEO E IMAGEN ---
  const renderMedia = (product: Product) => {
    // 1. Si hay VIDEO, tiene prioridad sobre la foto
    if (product.video) {
      // A) Es YouTube?
      if (
        product.video.includes("youtube.com") ||
        product.video.includes("youtu.be")
      ) {
        let videoId = "";
        try {
          if (product.video.includes("v=")) {
            videoId = product.video.split("v=")[1].split("&")[0];
          } else if (product.video.includes("youtu.be")) {
            videoId = product.video.split("/").pop() || "";
          }
        } catch (e) {
          console.error("Error parseando URL de youtube", e);
        }

        return (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={product.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "4px" }}
          ></iframe>
        );
      }

      // B) Es un archivo directo (.mp4, etc)
      return (
        <video
          src={product.video}
          controls
          width="100%"
          height="100%"
          style={{ backgroundColor: "#000", borderRadius: "4px" }}
        />
      );
    }

    // 2. Si NO hay video, mostrar FOTO (Inteligente)
    if (product.image) {
      // ¿Es un link externo (http)? Lo usamos directo.
      // ¿Es un archivo local? Le ponemos el prefijo BASE_URL.
      const imageSrc = product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}/${product.image.replace(/\\/g, "/")}`;

      return (
        <img
          src={imageSrc}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // Si la imagen falla, la ocultamos suavemente
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

    // 3. Nada
    return <span style={{ color: "#aaa" }}>Sin Imagen</span>;
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/logo.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "4rem 2rem",
        marginBottom: "2rem",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)",
        color: "white",
        textAlign: "center",
        borderRadius: "8px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2.5rem",
        }}
      >
        Nuestros Productos
      </h1>

      {/* --- FILTROS --- */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.8rem",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#2a2a2a",
            color: "white",
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#2a2a2a",
            color: "white",
          }}
        >
          <option value="">Todas las Categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}
            style={{
              padding: "0.8rem",
              cursor: "pointer",
              background: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* --- GRID DE PRODUCTOS --- */}
      {loading ? (
        <div>Buscando...</div>
      ) : products.length === 0 ? (
        <p style={{ color: "#aaa" }}>No hay productos.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {products.map((product) => {
            const hasStock = product.stock > 0;

            return (
              <div
                key={product.id}
                style={{
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  background: "#2a2a2a",
                  position: "relative",
                  opacity: hasStock ? 1 : 0.7,
                }}
              >
                {/* ETIQUETA STOCK */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: hasStock ? "#2ecc71" : "#e74c3c",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    zIndex: 10,
                  }}
                >
                  {hasStock ? `Stock: ${product.stock}` : "AGOTADO"}
                </div>

                {/* --- ZONA MULTIMEDIA (VIDEO O FOTO) --- */}
                <div
                  style={{
                    height: "200px",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    overflow: "hidden",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #444",
                  }}
                >
                  {renderMedia(product)}
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
                      alert("Agregado al carrito 🛒");
                    }}
                    disabled={!hasStock}
                    style={{
                      padding: "0.5rem 1rem",
                      background: hasStock ? "#646cff" : "#555",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: hasStock ? "pointer" : "not-allowed",
                    }}
                  >
                    {hasStock ? "Añadir" : "Sin Stock"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
