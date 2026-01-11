import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { validateToken, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js"; // <--- 1. IMPORTAR UPLOAD

const router = Router();

// Rutas Públicas
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas de Admin (rutas protegidas)
// 2. AGREGAR 'upload.single("image")' AQUÍ ABAJO
router.post(
  "/",
  [validateToken, isAdmin, upload.single("image")],
  createProduct
);

router.put(
  "/:id",
  [validateToken, isAdmin, upload.single("image")],
  updateProduct
);
router.delete("/:id", [validateToken, isAdmin], deleteProduct);

export default router;
