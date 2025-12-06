import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/* Todas las rutas usarán el componente Layout */}
      <Route path="/" element={<Layout />}>
        {/* Rutas anidadas que se renderizarán en el <Outlet> */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Aquí añadiremos más rutas después (ej. /productos, /dashboard-admin) */}

        {/* Ruta para "Not Found" */}
        <Route path="*" element={<h2>404: Página No Encontrada</h2>} />
      </Route>
    </Routes>
  );
}

export default App;
