import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una nueva instancia de Sequelize con los datos de conexión
const db = new Sequelize(
  process.env.DB_NAME || "tienda_online", // Nombre de la DB
  process.env.DB_USER || "postgres", // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST || "localhost", // Host
    dialect: "postgres", // Le decimos que usaremos PostgreSQL
    logging: false, // Para no mostrar las consultas SQL en la consola
  }
);

export default db;
