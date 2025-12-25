import { useEffect, useState } from "react";
import type { Product } from "../services/product.service";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import type { Category } from "../services/category.service"; // <--- Importar
import { useCart } from "../context/CartContext";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Para el select
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    loadInitialData();
  }, []);

  // Carga inicial: Productos y Categorías
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

  // Función que se ejecuta cuando el usuario busca o cambia categoría
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll({
        name: searchTerm || undefined, // Si está vacío, enviamos undefined
        categoryId: selectedCategory || undefined,
      });
      setProducts(data);
    } catch (error) {
      console.error("Error filtrando:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto automático: Busca cada vez que cambian los filtros
  // (Puedes quitar esto si prefieres un botón "Buscar")
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);

  return (
    <div
      style={{
        // 1. La imagen (ruta desde public)
        backgroundImage: 'url("/logo.jpg")',
        // 2. Asegura que cubra todo el espacio sin repetirse
        backgroundSize: "cover",
        backgroundPosition: "center",
        // 3. Altura del banner
        padding: "4rem 2rem",
        marginBottom: "2rem",
        // 4. (IMPORTANTE) Una capa oscura encima para que se lea el texto
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

      {/* --- BARRA DE BÚSQUEDA Y FILTROS --- */}
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
            Limpiar Filtros
          </button>
        )}
      </div>
      {/* --- FIN BARRA --- */}

      {loading ? (
        <div style={{ textAlign: "center" }}>Buscando...</div>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#aaa" }}>
          No encontramos productos que coincidan con tu búsqueda. 🕵️‍♂️
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Mapeo de productos (sin cambios en la tarjeta) */}
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
              }}
            >
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
                    alert("Agregado al carrito 🛒");
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
