import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import type { Product } from "../../services/product.service";
import type { CreateProductData } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { Category } from "../../services/category.service";

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estado para el formulario
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
  });

  // Cargamos datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargamos productos y categorías en paralelo
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Por favor selecciona una categoría");
      return;
    }

    try {
      await productService.create(formData);
      alert("Producto creado!");
      // Limpiar formulario y recargar
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
      });
      loadData();
    } catch (error) {
      alert("Error al crear producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await productService.delete(id);
      loadData();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>Gestión de Productos</h2>

      {/* Formulario */}
      <div
        style={{
          background: "#333",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h3>Nuevo Producto</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <input
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem" }}
          />

          <input
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem" }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem" }}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem" }}
            />
          </div>

          {/* SELECTOR DE CATEGORÍA */}
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem" }}
          >
            <option value="">-- Selecciona una Categoría --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

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

      {/* Tabla de Productos */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#444", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Nombre</th>
            <th style={{ padding: "0.5rem" }}>Precio</th>
            <th style={{ padding: "0.5rem" }}>Categoría</th>
            <th style={{ padding: "0.5rem" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} style={{ borderBottom: "1px solid #444" }}>
              <td style={{ padding: "0.5rem" }}>{prod.name}</td>
              <td style={{ padding: "0.5rem" }}>${prod.price}</td>
              <td style={{ padding: "0.5rem" }}>
                {prod.Category?.name || "Sin Categoría"}
              </td>
              <td style={{ padding: "0.5rem" }}>
                <button
                  onClick={() => handleDelete(prod.id)}
                  style={{
                    background: "#d32f2f",
                    padding: "0.3rem 0.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
