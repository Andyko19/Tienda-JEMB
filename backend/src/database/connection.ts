import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Definimos la conexión
let db: Sequelize;

if (process.env.DATABASE_URL) {
  // CONFIGURACIÓN PARA PRODUCCIÓN (NUBE)
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necesario para conexiones seguras en Render/Railway
      },
    },
  });
} else {
  // CONFIGURACIÓN PARA LOCAL (TU PC)
  db = new Sequelize(
    process.env.DB_NAME || "tienda_jemb",
    process.env.DB_USER || "postgres",
    process.env.DB_PASS || "1234", // Tu contraseña local
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );
}

export default db;
