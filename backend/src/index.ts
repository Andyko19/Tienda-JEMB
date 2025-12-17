import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./database/connection.js";

// Importamos Modelos
import UserModel from "./database/models/user.model.js";
import Category from "./database/models/category.model.js";
import Product from "./database/models/product.model.js";
import Order from "./database/models/order.model.js"; // <--- NUEVO
import OrderItem from "./database/models/orderItem.model.js"; // <--- NUEVO

// Importamos Rutas
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js"; // <--- NUEVO
import path from "path"; // <--- Importar path
import { fileURLToPath } from "url"; // <--- Necesario para __dirname en módulos ES
import fs from "fs";

// Cargar variables de entorno
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clase para representar nuestro servidor
class Server {
  private app: express.Application;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
    categories: "/api/categories",
    products: "/api/products",
    orders: "/api/orders", // <--- NUEVA RUTA
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3001";

    // Orden de ejecución importante:
    this.dbConnect();
    this.middlewares();
    this.routes();
  }

  private async dbConnect() {
    try {
      // Sincronizamos modelos existentes
      await UserModel.sync({ force: false });
      await Category.sync({ force: false });
      await Product.sync({ force: false }); // Usamos alter:true para actualizar esquema si es necesario

      // Sincronizamos los NUEVOS modelos de órdenes
      // (Es importante el orden si hay relaciones, pero force:false lo maneja bien)
      await Order.sync({ force: false }); // <--- CREAR TABLA ORDERS
      await OrderItem.sync({ force: false }); // <--- CREAR TABLA ORDER_ITEMS

      console.log("✅ Base de datos sincronizada y conectada.");
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
    }
  }

  private middlewares() {
    this.app.use(cors()); // Habilitar CORS
    this.app.use(express.json()); // Lectura de JSON
    const uploadsPath = path.join(process.cwd(), "uploads");

    console.log("---------------------------------------------------");
    console.log("📂 CARPETA DE IMÁGENES CONFIGURADA EN:");
    console.log(uploadsPath);
    console.log("---------------------------------------------------");

    // Servir la carpeta estática
    this.app.use("/uploads", express.static(uploadsPath));
    this.app.get("/test-images", (req, res) => {
      try {
        // Leemos qué hay en la carpeta
        const files = fs.readdirSync(uploadsPath);

        res.json({
          message: "Diagnóstico de imágenes",
          rutaConfigurada: uploadsPath,
          archivosEncontrados: files,
          ejemploURL:
            files.length > 0
              ? `http://localhost:3001/uploads/${files[0]}`
              : "No hay archivos para generar ejemplo",
        });
      } catch (error: any) {
        res.status(500).json({
          message: "Error leyendo carpeta",
          error: error.message,
          rutaIntentada: uploadsPath,
        });
      }
    });
  }

  private routes() {
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.categories, categoryRoutes);
    this.app.use(this.apiPaths.products, productRoutes);
    this.app.use(this.apiPaths.orders, orderRoutes); // <--- REGISTRAR LA RUTA
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor backend corriendo en el puerto ${this.port}`);
    });
  }
}

// Iniciar el servidor
const server = new Server();
server.listen();
