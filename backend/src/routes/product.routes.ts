import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { validateToken, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js"; // <--- 1. IMPORTANTE: Importar upload

const router = Router();

// Rutas Públicas
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas de Admin (rutas protegidas)
// 2. IMPORTANTE: Agregamos 'upload.single("image")' en la lista de middlewares
router.post(
  "/",
  [validateToken, isAdmin, upload.single("image")],
  createProduct
);

router.put("/:id", [validateToken, isAdmin], updateProduct);
router.delete("/:id", [validateToken, isAdmin], deleteProduct);

export default router;
