import express from "express";
import dotenv from "dotenv";
import db from "./database/connection.js";
import UserModel from "./database/models/user.model.js";
import authRoutes from "./routes/auth.routes.js";
import Category from "./database/models/category.model.js";
import Product from "./database/models/product.model.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";

// Cargar variables de entorno
dotenv.config();

// Clase para representar nuestro servidor
class Server {
  private app: express.Application;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
    categories: "/api/categories",
    products: "/api/products",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3001";

    this.dbConnect();
    this.middlewares();
    this.routes();
  }

  private async dbConnect() {
    try {
      await UserModel.sync({ force: false });
      await Category.sync({ force: false });
      await Product.sync({ force: false });

      console.log("✅ Base de datos sincronizada y conectada.");
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
    }
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.categories, categoryRoutes);
    this.app.use(this.apiPaths.products, productRoutes);
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
