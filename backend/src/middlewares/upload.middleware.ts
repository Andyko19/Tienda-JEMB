import multer from "multer";
import path from "path";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Le decimos que guarde los archivos en la carpeta 'uploads'
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generamos un nombre único: timestamp + extensión original
    // Ejemplo: 16789999_foto.jpg
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

export const upload = multer({ storage, fileFilter });
