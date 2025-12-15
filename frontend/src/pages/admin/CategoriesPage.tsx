import { useEffect, useState } from "react";
import { categoryService } from "../../services/category.service";
import type { Category } from "../../services/category.service";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías al entrar a la página
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error al cargar categorías", err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newCategoryName.trim()) return;

    try {
      await categoryService.create(newCategoryName);
      setNewCategoryName(""); // Limpiar input
      loadCategories(); // Recargar la lista para ver la nueva
      alert("Categoría creada con éxito");
    } catch (err: any) {
      setError("Error al crear categoría. Verifica que seas Admin.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await categoryService.delete(id);
      loadCategories();
    } catch (err) {
      alert("Error al eliminar. Puede que tenga productos asociados.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h2>Gestión de Categorías</h2>

      {/* Formulario de Creación */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #444",
          borderRadius: "8px",
        }}
      >
        <h3>Nueva Categoría</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Crear
          </button>
        </form>
      </div>

      {/* Lista de Categorías */}
      <h3>Lista Existente</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.8rem",
              borderBottom: "1px solid #333",
            }}
          >
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              style={{
                backgroundColor: "#d32f2f",
                padding: "0.3rem 0.8rem",
                fontSize: "0.8rem",
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
        {categories.length === 0 && <p>No hay categorías aún.</p>}
      </ul>
    </div>
  );
};
