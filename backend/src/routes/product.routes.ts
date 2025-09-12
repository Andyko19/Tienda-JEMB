import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

// Rutas Públicas
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas de Admin (protegeremos más adelante)
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
