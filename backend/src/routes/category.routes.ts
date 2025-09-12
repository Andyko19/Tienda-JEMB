import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

// Ruta para obtener todas las categorías (Pública)
router.get("/", getAllCategories);

// Rutas que deberían ser solo para administradores (lo protegeremos más adelante)
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
