import { useEffect, useState } from "react";
import type { Product } from "../../services/product.service";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { Category } from "../../services/category.service";

// Definimos las constantes de URL igual que hicimos antes
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const BASE_URL = API_URL.replace("/api", "");

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estados del formulario
  const [editingId, setEditingId] = useState<string | null>(null); // ¿Estamos editando?
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [video, setVideo] = useState(""); // <--- NUEVO CAMPO VIDEO
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [prods, cats] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
    ]);
    setProducts(prods);
    setCategories(cats);
    if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
  };

  // Función para cargar los datos en el formulario al dar clic en "Editar"
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategoryId(product.categoryId);
    setVideo(product.video || ""); // Cargar video si existe
    setSelectedFile(null); // Reseteamos la imagen seleccionada
    // Scroll hacia arriba para ver el form
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
      formData.append("video", video); // <--- ENVIAMOS EL VIDEO

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editingId) {
        // MODO EDICIÓN
        await productService.update(editingId, formData);
        alert("Producto actualizado correctamente ✅");
      } else {
        // MODO CREACIÓN
        await productService.create(formData);
        alert("Producto creado con éxito ✅");
      }

      // Limpiar formulario
      setEditingId(null);
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setVideo("");
      setSelectedFile(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
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
      <h2>{editingId ? "✏️ Editando Producto" : "➕ Crear Nuevo Producto"}</h2>

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
            placeholder="Stock (Unidades)"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{ flex: 1, padding: "8px" }}
          />
        </div>

        {/* INPUT DE VIDEO */}
        <input
          placeholder="Link de Video (YouTube, Vimeo, etc...)"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #555",
            background: "#333",
            color: "white",
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

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              background: editingId ? "#f39c12" : "#27ae60",
              color: "white",
              border: "none",
              cursor: "pointer",
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
                setDescription("");
              }}
              style={{
                padding: "10px",
                background: "#7f8c8d",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Productos</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
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
            {p.image && (
              <img
                src={`${BASE_URL}/${p.image.replace(/\\/g, "/")}`}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
              />
            )}
            <h4 style={{ margin: "0 0 5px 0" }}>{p.name}</h4>
            <p
              style={{
                color: p.stock > 0 ? "#2ecc71" : "#e74c3c",
                fontWeight: "bold",
              }}
            >
              Stock: {p.stock}
            </p>
            <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
              <button
                onClick={() => handleEdit(p)}
                style={{
                  flex: 1,
                  background: "#3498db",
                  border: "none",
                  color: "white",
                  padding: "5px",
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
                  padding: "5px",
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
