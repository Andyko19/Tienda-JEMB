import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CategoriesPage } from "./pages/admin/CategoriesPage";
import { ProductsPage } from "./pages/admin/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Nueva ruta para categorías */}

        <Route path="admin/categories" element={<CategoriesPage />} />
        <Route path="admin/products" element={<ProductsPage />} />

        <Route path="cart" element={<CartPage />} />
        <Route path="my-orders" element={<MyOrdersPage />} />

        <Route path="*" element={<h2>404: Página No Encontrada</h2>} />
      </Route>
    </Routes>
  );
}

export default App;
