import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { validateToken, isAdmin } from "../middlewares/auth.middleware.js"; // Importante no borrar esto
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Configuración para recibir 'image' y 'video'
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// Rutas Públicas
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas Privadas (Admin)
router.post(
  "/",
  [validateToken, isAdmin, uploadFields], // Usamos el middleware de campos múltiples
  createProduct
);

router.put("/:id", [validateToken, isAdmin, uploadFields], updateProduct);

router.delete("/:id", [validateToken, isAdmin], deleteProduct);

export default router;
