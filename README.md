# JEMB Store - E-Commerce Full Stack

![Status](https://img.shields.io/badge/Status-Terminado-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)

**JEMB Store** es una plataforma de comercio electrónico completa desarrollada desde cero. Este proyecto simula un entorno real de ventas en línea, integrando un frontend moderno y reactivo con una API RESTful robusta y una base de datos relacional.

**Demo Desplegado:**

- **Frontend (Vercel):** https://tienda-jemb.vercel.app/
- **Backend (Render):** https://tienda-backend-n3xi.onrender.com

---

## Características Principales

### Cliente / Usuario

- **Autenticación Segura:** Registro e inicio de sesión con validación de credenciales (JWT).
- **Catálogo Dinámico:** Exploración de productos filtrados por categorías.
- **Carrito de Compras:** Gestión de estado global para agregar, eliminar y modificar cantidades de productos en tiempo real.
- **Gestión de Pedidos:** Generación de órdenes de compra y visualización del historial de pedidos propios ("Mis Pedidos").

### Panel de Administración

- **Gestión de Productos (CRUD):** Crear, editar y eliminar productos con carga de imágenes.
- **Gestión de Categorías:** Administración dinámica de las categorías de la tienda.
- **Seguridad:** Rutas protegidas exclusivas para usuarios con rol de administrador.

---

## Tech Stack (Tecnologías)

### Frontend

- **Framework:** React.js (con Vite para un build optimizado).
- **Lenguaje:** TypeScript (para tipado estático y robustez).
- **Estado Global:** Context API (AuthContext, CartContext).
- **Estilos:** CSS3 Moderno / Diseño Responsivo.
- **Consumo de API:** Fetch / Axios.

### Backend

- **Entorno:** Node.js.
- **Framework:** Express.js.
- **Base de Datos:** SQL (PostgreSQL/MySQL) usando **Sequelize ORM**.
- **Autenticación:** JSON Web Tokens (JWT) y Bcrypt para hasheo de contraseñas.
- **Manejo de Archivos:** Multer (para subida de imágenes de productos).

---

## Estructura del Proyecto

El proyecto es un monorepositorio dividido en dos carpetas principales:

```bash
tienda-jemb/
├── backend/         # API RESTful, Modelos y Controladores
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio (Auth, Productos, Ordenes)
│   │   ├── database/     # Conexión y Modelos Sequelize
│   │   ├── middlewares/  # Protección de rutas y upload de archivos
│   │   └── routes/       # Definición de endpoints
│
└── frontend/        # Aplicación React (Cliente)
    ├── src/
    │   ├── context/      # Estado global (Auth, Cart)
    │   ├── pages/        # Vistas (Home, Login, Admin, etc.)
    │   └── services/     # Comunicación con el Backend

# Instalación y Ejecución Local
Si deseas correr este proyecto en tu máquina local, sigue estos pasos:

1. Clonar el repositorio
git clone [https://github.com/TU_USUARIO/tienda-jemb.git](https://github.com/TU_USUARIO/tienda-jemb.git)
cd tienda-jemb
2. Configurar el Backend:
cd backend
npm install
3. Crea un archivo .env en la carpeta backend con las siguientes variables:
PORT=3000
DB_NAME=nombre_tu_base_datos
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_HOST=localhost
JWT_SECRET=tu_palabra_secreta
Ejecutar servidor:
npm run dev
3. Configurar el Frontend
cd frontend
npm install
Ejecutar cliente:
npm run dev
Licencia
Este proyecto fue desarrollado con fines educativos y de portafolio profesional.
Desarrollado  por Jorge Andrés Gualán Desarrollador Full Stack | JavaScript | TypeScript
```
