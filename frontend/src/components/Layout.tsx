import { useState } from "react"; // Importamos useState para el menú
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  // Estado para controlar si el menú móvil está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false); // Cerrar menú al salir
  };

  // Función para cerrar menú al dar clic en un enlace
  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="container nav-content">
          {/* LOGO */}
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            🛍️ Bienvenido a JEMB Store
          </Link>

          {/* BOTÓN HAMBURGUESA (Solo visible en Móvil gracias al CSS) */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* MENÚ DE NAVEGACIÓN */}
          {/* Si menuOpen es true, agregamos la clase 'active' para que el CSS lo muestre */}
          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Inicio
              </Link>
            </li>

            <li>
              <Link to="/cart" className="nav-link" onClick={closeMenu}>
                🛒 Carrito
                {count > 0 && (
                  <span
                    style={{
                      background: "#d32f2f",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      marginLeft: "5px",
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/my-orders"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    📦 Mis Compras
                  </Link>
                </li>

                {user?.role === "admin" && (
                  <>
                    <li>
                      <Link
                        to="/admin/categories"
                        className="nav-link"
                        style={{ color: "#ffd700" }}
                        onClick={closeMenu}
                      >
                        Categorías
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/products"
                        className="nav-link"
                        style={{ color: "#ffd700" }}
                        onClick={closeMenu}
                      >
                        Productos
                      </Link>
                    </li>
                  </>
                )}

                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                    Hola, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "transparent",
                      border: "1px solid #d32f2f",
                      color: "#d32f2f",
                      padding: "0.4rem 1rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link" onClick={closeMenu}>
                    Ingresar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="nav-link"
                    onClick={closeMenu}
                    style={{
                      background: "#646cff",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                    }}
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main style={{ flex: 1, padding: "1rem" }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="container">
          <h3 style={{ color: "#eee", margin: "0 0 1rem 0" }}>Tienda JEMB</h3>
          <p
            style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#888" }}
          >
            Los mejores productos al alcance de un clic. Envíos a todo el país.
            🇪🇨
          </p>

          <div className="footer-socials">
            {/* ENLACES REALES (Se abren en nueva pestaña) */}
            <a
              href="https://instagram.com/TU_USUARIO"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ justifyContent: "center" }}
            >
              📸 Instagram
            </a>
            <a
              href="https://facebook.com/TU_PAGINA"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ justifyContent: "center" }}
            >
              📘 Facebook
            </a>
            <a
              href="https://twitter.com/TU_USUARIO"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ justifyContent: "center" }}
            >
              🐦 Twitter
            </a>
          </div>

          <div
            style={{
              borderTop: "1px solid #333",
              paddingTop: "1rem",
              fontSize: "0.8rem",
              color: "#666",
            }}
          >
            &copy; {new Date().getFullYear()} AG Corp. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
