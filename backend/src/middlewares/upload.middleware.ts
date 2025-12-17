import multer from "multer";
import path from "path";
import fs from "fs";

// Aseguramos que la carpeta exista antes de nada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("📂 Carpeta uploads no existía, creándola en:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usamos la ruta absoluta garantizada
    console.log("📥 Multer recibiendo archivo, guardando en:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const finalName = uniqueSuffix + ext;
    console.log("📄 Nombre generado para el archivo:", finalName);
    cb(null, finalName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    console.warn("⚠️ Archivo rechazado: No es una imagen");
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

export const upload = multer({ storage, fileFilter });
