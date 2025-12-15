import { Router } from "express";
import {
  createOrder,
  getOrdersByUser,
} from "../controllers/order.controller.js"; // <--- Importar getOrdersByUser
import { validateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Crear orden (POST)
router.post("/", validateToken, createOrder);

// Obtener mis órdenes (GET)
router.get("/", validateToken, getOrdersByUser); // <--- Nueva ruta

export default router;
