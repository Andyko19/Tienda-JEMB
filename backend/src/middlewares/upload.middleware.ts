import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Aseguramos que la carpeta uploads exista
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único: TIMESTAMP.extensión
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

// 3. Exportar el middleware configurado
export const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB límite
  fileFilter: (req, file, cb) => {
    // Aceptar imágenes y videos
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Formato no soportado. Solo imágenes y videos."));
    }
  },
});
