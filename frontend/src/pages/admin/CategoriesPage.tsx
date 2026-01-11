import { useEffect, useState } from "react";
import type { Category } from "../../services/category.service";
import { categoryService } from "../../services/category.service";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryService.update(editingId, name);
      } else {
        await categoryService.create(name);
      }
      setEditingId(null);
      setName("");
      loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Borrar categoría?")) {
      await categoryService.delete(id);
      loadCategories();
    }
  };

  return (
    // CAMBIO 1: width: "100%" para que no se salga en móvil
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        {editingId ? "✏️ Editar Categoría" : "📂 Categorías"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#222",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap", // CAMBIO 2: Esto permite que el botón baje en celulares
        }}
      >
        <input
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, minWidth: "200px", padding: "10px" }} // minWidth evita que se haga minúsculo
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: editingId ? "#f39c12" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Guardar" : "Crear"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
            style={{
              padding: "10px",
              background: "#7f8c8d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div style={{ display: "grid", gap: "1rem" }}>
        {categories.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#1a1a1a",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              flexWrap: "wrap", // CAMBIO 3: Para que los botones bajen si el nombre es muy largo
              gap: "10px",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {c.name}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleEdit(c)}
                style={{
                  padding: "5px 10px",
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                style={{
                  padding: "5px 10px",
                  background: "#c0392b",
                  color: "white",
                  border: "none",
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
