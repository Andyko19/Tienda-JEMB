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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  const BASE_URL = API_URL.replace("/api", "");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error(error);
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);

  // --- 🧠 CEREBRO TRADUCTOR DE VIDEOS MEJORADO 🧠 ---
  const renderMedia = (product: Product) => {
    const videoUrl = product.video;

    if (videoUrl) {
      // 1. YOUTUBE (Funciona perfecto)
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        let videoId = "";
        try {
          if (videoUrl.includes("v="))
            videoId = videoUrl.split("v=")[1].split("&")[0];
          else if (videoUrl.includes("youtu.be"))
            videoId = videoUrl.split("/").pop() || "";
        } catch (e) {}
        return (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={product.name}
            frameBorder="0"
            allowFullScreen
            style={{ borderRadius: "4px" }}
          ></iframe>
        );
      }

      // 2. FACEBOOK (Corrección de Link)
      if (videoUrl.includes("facebook.com") || videoUrl.includes("fb.watch")) {
        // Truco: Aseguramos que sea un link web y no móvil
        let cleanFbUrl = videoUrl.replace("m.facebook.com", "www.facebook.com");
        const encodedUrl = encodeURIComponent(cleanFbUrl);

        return (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&t=0`}
              width="100%"
              height="100%"
              style={{
                border: "none",
                overflow: "hidden",
                borderRadius: "4px",
                background: "black",
              }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
            {/* Aviso por si falla la privacidad */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                fontSize: "9px",
                color: "#666",
                textAlign: "center",
                background: "rgba(0,0,0,0.7)",
                padding: "2px",
              }}
            >
              Si no carga, el video es Privado o +18
            </div>
          </div>
        );
      }

      // 3. TIKTOK (Corrección de Extracción)
      if (videoUrl.includes("tiktok.com")) {
        try {
          // Intentamos extraer ID aunque haya signos de interrogación ?
          // Ejemplo: .../video/746839284738?params...
          const match = videoUrl.match(/video\/(\d+)/);
          const tiktokId = match ? match[1] : null;

          if (tiktokId) {
            return (
              <iframe
                src={`https://www.tiktok.com/embed/v2/${tiktokId}?lang=es-ES`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: "4px", background: "#000" }}
              ></iframe>
            );
          } else {
            // Si no encontramos ID (es link corto vm.tiktok...), mostramos aviso
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                  color: "#ccc",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <p style={{ margin: 0, fontSize: "2rem" }}>⚠️</p>
                <p style={{ fontSize: "0.8rem" }}>Enlace corto no soportado.</p>
                <p style={{ fontSize: "0.7rem", color: "#888" }}>
                  Usa el link largo del navegador o sube el archivo.
                </p>
              </div>
            );
          }
        } catch (e) {
          console.error("Error TikTok", e);
        }
      }

      // 4. INSTAGRAM (Añade /embed)
      if (videoUrl.includes("instagram.com")) {
        const cleanUrl = videoUrl.split("?")[0].replace(/\/$/, "");
        return (
          <iframe
            src={`${cleanUrl}/embed`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            style={{ borderRadius: "4px" }}
          ></iframe>
        );
      }

      // 5. ARCHIVO MP4
      const videoSrc = videoUrl.startsWith("http")
        ? videoUrl
        : `${BASE_URL}/${videoUrl.replace(/\\/g, "/")}`;
      return (
        <video
          src={videoSrc}
          controls
          playsInline
          width="100%"
          height="100%"
          style={{ backgroundColor: "#000", borderRadius: "4px" }}
        />
      );
    }

    // FOTO
    if (product.image) {
      const imageSrc = product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}/${product.image.replace(/\\/g, "/")}`;
      return (
        <img
          src={imageSrc}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

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
      <h1 style={{ marginBottom: "2rem" }}>Nuestros Productos</h1>

      {/* Filtros */}
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
          placeholder="🔍 Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.8rem",
            width: "300px",
            borderRadius: "4px",
            background: "#2a2a2a",
            color: "white",
            border: "1px solid #444",
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            background: "#2a2a2a",
            color: "white",
            border: "1px solid #444",
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

      {/* Grid */}
      {loading ? (
        <div>Buscando...</div>
      ) : products.length === 0 ? (
        <p>No hay productos.</p>
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

                {/* ZONA MULTIMEDIA */}
                <div
                  style={{
                    height: "350px",
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
                      alert("Agregado 🛒");
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
