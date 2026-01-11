import { useEffect, useState } from "react";
import type { Product } from "../../services/product.service";
import { productService } from "../../services/product.service";
import type { Category } from "../../services/category.service";
import { categoryService } from "../../services/category.service";

// URL base para previsualizar imágenes/videos locales
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

  // --- ARCHIVOS MULTIMEDIA ---
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

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
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategoryId(product.categoryId);

    // Cargar Imagen
    if (product.image && product.image.startsWith("http"))
      setImageUrl(product.image);
    else setImageUrl("");
    setSelectedFile(null);

    // Cargar Video
    if (product.video && product.video.startsWith("http"))
      setVideoUrl(product.video);
    else setVideoUrl("");
    setSelectedVideoFile(null);

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

      // IMAGEN
      if (selectedFile) formData.append("image", selectedFile);
      else if (imageUrl) formData.append("image", imageUrl);

      // VIDEO
      if (selectedVideoFile) formData.append("video", selectedVideoFile);
      else if (videoUrl) formData.append("video", videoUrl);

      if (editingId) {
        await productService.update(editingId, formData);
        alert("¡Producto actualizado! ✅");
      } else {
        await productService.create(formData);
        alert("¡Producto creado! ✅");
      }

      // Reset
      setEditingId(null);
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setSelectedFile(null);
      setVideoUrl("");
      setSelectedVideoFile(null);

      const fInput = document.getElementById("fileInput") as HTMLInputElement;
      const vInput = document.getElementById("videoInput") as HTMLInputElement;
      if (fInput) fInput.value = "";
      if (vInput) vInput.value = "";

      loadData();
    } catch (error) {
      console.error(error);
      alert("Error al guardar. Si es un video pesado, espera un poco más.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Borrar producto?")) {
      await productService.delete(id);
      loadData();
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>{editingId ? "✏️ Editar Producto" : "➕ Crear Nuevo Producto"}</h2>

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
          style={{ padding: "10px" }}
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px", minHeight: "80px" }}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="number"
            placeholder="Precio ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ flex: 1, padding: "10px" }}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{ flex: 1, padding: "10px" }}
          />
        </div>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: "10px" }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SECCIÓN VIDEO */}
        <div
          style={{
            border: "1px dashed #666",
            padding: "15px",
            borderRadius: "4px",
            background: "#2a2a2a",
          }}
        >
          <p style={{ marginTop: 0, color: "#4caf50", fontWeight: "bold" }}>
            🎥 Video:
          </p>

          <input
            placeholder="Link (YouTube, Facebook) o déjalo vacío"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setSelectedVideoFile(null);
            }}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              background: "#444",
              color: "white",
              border: "1px solid #555",
            }}
          />
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "0.8rem",
              marginBottom: "5px",
            }}
          >
            - O SUBIR ARCHIVO MP4 (Recomendado para TikTok) -
          </div>
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedVideoFile(e.target.files[0]);
                setVideoUrl("");
              }
            }}
            style={{ color: "white" }}
          />
        </div>

        {/* SECCIÓN IMAGEN */}
        <div
          style={{
            border: "1px dashed #666",
            padding: "15px",
            borderRadius: "4px",
            background: "#2a2a2a",
          }}
        >
          <p style={{ marginTop: 0, color: "#f39c12", fontWeight: "bold" }}>
            🖼️ Imagen:
          </p>
          <input
            placeholder="Link de imagen (http...)"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setSelectedFile(null);
            }}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              background: "#444",
              color: "white",
              border: "1px solid #555",
            }}
          />
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "0.8rem",
              marginBottom: "5px",
            }}
          >
            - O SUBIR FOTO -
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
                setImageUrl("");
              }
            }}
            style={{ color: "white" }}
          />
        </div>

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
            {editingId ? "Guardar" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              style={{ padding: "12px" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA DE PRODUCTOS (Ahora con FOTO y VIDEO mini) */}
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
            {/* MINIATURA FOTO */}
            <div
              style={{
                height: "100px",
                background: "#000",
                marginBottom: "5px",
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
                />
              ) : (
                <span style={{ color: "#555", fontSize: "0.8rem" }}>
                  Sin Foto
                </span>
              )}
            </div>

            {/* INDICADOR VIDEO */}
            {p.video && (
              <div
                style={{
                  background: "#e74c3c",
                  color: "white",
                  fontSize: "0.7rem",
                  padding: "2px",
                  textAlign: "center",
                  borderRadius: "2px",
                  marginBottom: "5px",
                }}
              >
                🎥 TIENE VIDEO
              </div>
            )}

            <h4 style={{ margin: "0 0 5px 0" }}>{p.name}</h4>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                onClick={() => handleEdit(p)}
                style={{
                  flex: 1,
                  background: "#3498db",
                  color: "white",
                  padding: "5px",
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  flex: 1,
                  background: "#c0392b",
                  color: "white",
                  padding: "5px",
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
