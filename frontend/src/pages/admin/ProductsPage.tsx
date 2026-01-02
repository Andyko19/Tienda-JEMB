import { useEffect, useState } from "react";
import type { Product } from "../../services/product.service";
import { productService } from "../../services/product.service";
import type { Category } from "../../services/category.service";
import { categoryService } from "../../services/category.service";

export const ProductsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  const BASE_URL = API_URL.replace("/api", "");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Estado para guardar el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !categoryId)
        setCategoryId(categoriesData[0].id);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId)
      return alert("Completa los campos obligatorios");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("categoryId", categoryId);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await productService.create(formData);

      // Limpieza
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setSelectedFile(null);
      // Resetear el input de archivo visualmente
      const fileInput = document.getElementById(
        "fileInput"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      alert("Producto creado con éxito ✅");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Error al crear producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      await productService.delete(id);
      loadData();
    }
  };

  if (loading) return <div>Cargando panel...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>Administrar Productos</h2>

      <div
        style={{
          background: "#2a2a2a",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h3>Crear Nuevo Producto</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}
        >
          {/* CAMBIO: Agregamos name e id a los inputs */}
          <input
            name="name"
            id="name"
            placeholder="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "0.5rem" }}
            required
          />
          <textarea
            name="description"
            id="description"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: "0.5rem" }}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              name="price"
              id="price"
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ padding: "0.5rem", flex: 1 }}
              required
            />
            <input
              name="stock"
              id="stock"
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={{ padding: "0.5rem", flex: 1 }}
              required
            />
          </div>

          <select
            name="category"
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div
            style={{
              border: "1px dashed #666",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            <label
              htmlFor="fileInput"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#aaa",
              }}
            >
              Imagen:
            </label>
            <input
              name="image"
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "0.8rem",
              background: "#646cff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Guardar Producto
          </button>
        </form>
      </div>

      <h3>Lista de Productos</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #444",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            {product.image ? (
              <img
                src={`${BASE_URL}/${product.image.replace(/\\/g, "/")}`}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              />
            ) : (
              <div
                style={{
                  height: "150px",
                  background: "#555",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Sin Foto
              </div>
            )}

            <h4 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h4>
            <p style={{ margin: 0, color: "#aaa" }}>${product.price}</p>
            <button
              onClick={() => handleDelete(product.id)}
              style={{
                marginTop: "0.5rem",
                background: "#d32f2f",
                color: "white",
                border: "none",
                padding: "0.3rem 0.5rem",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
