import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { validateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Ruta para obtener todas las categorías (Pública)
router.get("/", getAllCategories);

// Rutas para administradores
router.post("/", [validateToken, isAdmin], createCategory);
router.put("/:id", [validateToken, isAdmin], updateCategory);
router.delete("/:id", [validateToken, isAdmin], deleteCategory);

export default router;
