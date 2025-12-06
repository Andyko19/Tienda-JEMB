import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

// Definimos la forma que tienen los datos del usuario
interface User {
  id: string;
  email: string;
  role: "customer" | "admin";
  name?: string;
}

// Definimos qué funciones y datos tendrá nuestro contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Creamos el contexto (empieza vacío)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el "Proveedor" que envolverá a toda la app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la página, revisamos si ya hay un usuario guardado en el navegador
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Función para iniciar sesión (actualiza el estado y el localStorage)
  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión (borra todo)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
