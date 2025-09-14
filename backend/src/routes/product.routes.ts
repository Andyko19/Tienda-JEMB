import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { validateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas Públicas
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas de Admin (rutas protegidas)
router.post("/", [validateToken, isAdmin], createProduct);
router.put("/:id", [validateToken, isAdmin], updateProduct);
router.delete("/:id", [validateToken, isAdmin], deleteProduct);

export default router;
