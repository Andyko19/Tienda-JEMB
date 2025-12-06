import { useState } from "react";
import { authService } from "../services/auth.service";
import type { LoginData } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); //

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Enviamos las credenciales al backend
      const response = await authService.login(formData);
      login(response.token, response.user);

      // 2. Guardamos el token y los datos del usuario en el navegador
      // 'localStorage' permite guardar datos incluso si cierras la ventana
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("¡Bienvenido de nuevo!");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Iniciar Sesión</h2>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid red",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
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

        <button
          type="submit"
          style={{ padding: "0.8rem", marginTop: "1rem", cursor: "pointer" }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};
