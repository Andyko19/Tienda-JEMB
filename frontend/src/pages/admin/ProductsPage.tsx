import { useEffect, useState } from "react";
import type { Product } from "../../services/product.service";
import { productService } from "../../services/product.service";
import type { Category } from "../../services/category.service";
import { categoryService } from "../../services/category.service";

// Configuración de URL para previsualizar imágenes
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const BASE_URL = API_URL.replace("/api", "");

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estados del formulario
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [video, setVideo] = useState("");

  // --- NUEVA LÓGICA DE IMAGEN ---
  const [imageUrl, setImageUrl] = useState(""); // Para links externos
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Para subidas locales
  // ------------------------------

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategoryId(product.categoryId);
    setVideo(product.video || "");

    // Lógica inteligente: ¿Es link o archivo?
    if (product.image && product.image.startsWith("http")) {
      setImageUrl(product.image); // Si es link, llenamos el campo de texto
    } else {
      setImageUrl(""); // Si es archivo local, dejamos limpio
    }

    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("categoryId", categoryId);
      formData.append("video", video);

      // DECISIÓN DE IMAGEN A ENVIAR:
      if (selectedFile) {
        // Opción A: Usuario eligió un archivo del PC -> Enviamos archivo binario
        formData.append("image", selectedFile);
      } else if (imageUrl) {
        // Opción B: Usuario pegó un link -> Enviamos el texto del link
        formData.append("image", imageUrl);
      }

      if (editingId) {
        await productService.update(editingId, formData);
        alert("Actualizado ✅");
      } else {
        await productService.create(formData);
        alert("Creado ✅");
      }

      // Limpiar formulario completo
      setEditingId(null);
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setVideo("");
      setImageUrl("");
      setSelectedFile(null);

      // Truco para limpiar el input type="file" visualmente
      const fileInput = document.getElementById(
        "fileInput"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      loadData();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Borrar?")) {
      await productService.delete(id);
      loadData();
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>{editingId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#222",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px" }}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="number"
            placeholder="Precio ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ flex: 1, padding: "8px" }}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{ flex: 1, padding: "8px" }}
          />
        </div>

        <input
          placeholder="Link de Video (Opcional)"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          style={{
            padding: "8px",
            background: "#333",
            color: "white",
            border: "1px solid #555",
          }}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: "8px" }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* --- SECCIÓN DE IMAGEN DOBLE --- */}
        <div
          style={{
            border: "1px dashed #666",
            padding: "15px",
            borderRadius: "4px",
            background: "#2a2a2a",
          }}
        >
          <p
            style={{
              marginTop: 0,
              color: "#ccc",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            Imagen del Producto (Elige una opción):
          </p>

          {/* Opción A: Link */}
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.8rem",
              color: "#aaa",
            }}
          >
            Opción 1: Pegar enlace de internet
          </label>
          <input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setSelectedFile(null); // Si escribe link, anulamos el archivo
              const fileInput = document.getElementById(
                "fileInput"
              ) as HTMLInputElement;
              if (fileInput) fileInput.value = "";
            }}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              boxSizing: "border-box",
              background: "#444",
              color: "white",
              border: "1px solid #555",
            }}
          />

          <div
            style={{
              textAlign: "center",
              margin: "10px 0",
              color: "#888",
              fontSize: "0.8rem",
            }}
          >
            - O -
          </div>

          {/* Opción B: Archivo */}
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.8rem",
              color: "#aaa",
            }}
          >
            Opción 2: Subir archivo desde tu PC
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
                setImageUrl(""); // Si sube archivo, borramos el link
              }
            }}
          />
        </div>
        {/* ------------------------------- */}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "12px",
              background: editingId ? "#f39c12" : "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Guardar Cambios" : "Crear Producto"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setImageUrl("");
                setDescription("");
                setPrice("");
                setStock("");
                setVideo("");
              }}
              style={{
                padding: "12px",
                background: "#7f8c8d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA CON PREVISUALIZACIÓN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #444",
              padding: "1rem",
              borderRadius: "8px",
              background: "#1a1a1a",
            }}
          >
            {/* Visualizador Inteligente para Admin */}
            <div
              style={{
                height: "140px",
                background: "#000",
                marginBottom: "10px",
                borderRadius: "4px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.image ? (
                <img
                  src={
                    p.image.startsWith("http")
                      ? p.image
                      : `${BASE_URL}/${p.image.replace(/\\/g, "/")}`
                  }
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")} // Ocultar si falla
                />
              ) : (
                <span style={{ color: "#666", fontSize: "0.8rem" }}>
                  Sin Foto
                </span>
              )}
            </div>

            <h4 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>
              {p.name}
            </h4>
            <p style={{ margin: "0 0 10px 0", color: "#aaa" }}>
              Stock: {p.stock}
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleEdit(p)}
                style={{
                  flex: 1,
                  background: "#3498db",
                  border: "none",
                  color: "white",
                  padding: "8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  flex: 1,
                  background: "#c0392b",
                  border: "none",
                  color: "white",
                  padding: "8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
