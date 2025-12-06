import { useState } from "react";
import { authService } from "../services/auth.service";
import type { RegisterData } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate(); // Para redirigir al usuario después de registrarse

  // Estado para guardar lo que el usuario escribe
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  // Función que se ejecuta cuando el usuario escribe en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función que se ejecuta cuando se envía el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    setError(null);

    try {
      await authService.register(formData);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      navigate("/login"); // Redirigimos al Login
    } catch (err: any) {
      // Si el backend devuelve un error (ej: "Email ya en uso"), lo mostramos
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Crear Cuenta</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button type="submit" style={{ padding: "0.8rem", marginTop: "1rem" }}>
          Registrarse
        </button>
      </form>
    </div>
  );
};
