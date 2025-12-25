import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let db: Sequelize;

if (process.env.DATABASE_URL) {
  // --- MODO PRODUCCIÓN (RENDER) ---
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Indispensable para que Render acepte la conexión
      },
    },
  });
} else {
  // --- MODO LOCAL (TU PC) ---
  db = new Sequelize(
    process.env.DB_NAME || "tienda_online",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "", // Asegúrate de que coincida con tu .env local
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );
}

export default db;
