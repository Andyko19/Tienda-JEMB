import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importamos el contexto

export const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Datos del usuario

  return (
    <div>
      <nav
        style={{
          padding: "1rem",
          borderBottom: "1px solid #444",
          marginBottom: "2rem",
        }}
      >
        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            gap: "2rem",
            padding: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <li>
            <Link to="/">Inicio</Link>
          </li>

          {/* Si está autenticado, mostramos su nombre y botón de salir */}
          {isAuthenticated ? (
            <>
              <li style={{ color: "#646cff", fontWeight: "bold" }}>
                Hola, {user?.name}
              </li>
              {/* Si es admin, mostramos un enlace extra (opcional por ahora) */}
              {user?.role === "admin" && (
                <li>
                  <span style={{ color: "gold" }}>[Admin]</span>
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    backgroundColor: "#d32f2f",
                  }}
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            /* Si NO está autenticado, mostramos Login y Registro */
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Registro</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
