import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let db: Sequelize;

if (process.env.DATABASE_URL) {
  // --- MODO NUBE (RENDER) ---
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Vital para que Render funcione
      },
    },
  });
} else {
  // --- MODO LOCAL (TU PC) ---
  db = new Sequelize(
    process.env.DB_NAME || "tienda_online",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );
}

export default db;
