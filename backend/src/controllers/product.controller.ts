import { Request, Response } from "express";
import Product from "../database/models/product.model.js";
import { v4 as uuidv4 } from "uuid";

// 1. Obtener todos los productos (con filtros opcionales)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.query;
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// 2. Obtener un producto por ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// 3. Crear producto (Soporta Archivo o Link)
export const createProduct = async (req: any, res: Response) => {
  // Extraemos 'image' del body por si viene como URL (texto)
  const { name, description, price, stock, categoryId, video, image } =
    req.body;

  try {
    // LÓGICA HÍBRIDA:
    // Prioridad 1: Si subieron archivo (req.file), usamos la ruta local 'uploads/...'.
    // Prioridad 2: Si no hay archivo, usamos el texto que venga en 'image' (el link).
    // Prioridad 3: Si no hay nada, string vacío.
    const imagePath = req.file ? `uploads/${req.file.filename}` : image || "";

    const newProduct = await Product.create({
      id: uuidv4(),
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId,
      image: imagePath, // Aquí se guarda "uploads/foto.jpg" O "https://google.com/foto.jpg"
      video: video || null,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// 4. Actualizar producto (Soporta Archivo o Link)
export const updateProduct = async (req: any, res: Response) => {
  const { id } = req.params;
  // Recibimos 'image' (texto) y 'video' del body
  const { name, description, price, stock, categoryId, video, image } =
    req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Lógica para decidir qué imagen guardar
    let finalImage = product.dataValues.image; // Por defecto mantenemos la vieja

    if (req.file) {
      // Caso A: Subieron archivo nuevo -> Reemplazamos por la ruta del archivo
      finalImage = `uploads/${req.file.filename}`;
    } else if (image && image.trim() !== "") {
      // Caso B: No subieron archivo, pero enviaron un LINK de texto nuevo -> Usamos el link
      finalImage = image;
    }

    await product.update({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId,
      image: finalImage,
      video: video || null,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
};

// 5. Borrar producto
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    await product.destroy();
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
