import type { Response } from "express";
import type { Request } from "express";
import Product from "../database/models/product.model.js";
import Category from "../database/models/category.model.js";
import { Op } from "sequelize";

// 1. Crear producto
export const createProduct = async (req: any, res: Response) => {
  // CAMBIO AQUÍ: Usamos 'filename' y agregamos 'uploads/' manualmente
  // Esto guarda "uploads/foto123.jpg" en la BD en lugar de "C:\Users\...\uploads\foto123.jpg"
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  const { name, description, price, stock, categoryId, video } = req.body;

  if (!name || !description || !price || !stock || !categoryId) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId,
      video,
      image: imagePath, // Ahora sí es una ruta web válida
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto." });
  }
};

// 2. Obtener productos (con filtros opcionales)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Extraemos los filtros de la URL (ej: ?name=zapato&categoryId=123)
    const { name, categoryId } = req.query;

    // Creamos un objeto de condiciones vacío
    const whereClause: any = {};

    // Si el usuario escribió un nombre, buscamos coincidencias (case-insensitive)
    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` };
      // Nota: Si usas MySQL en vez de Postgres, cambia Op.iLike por Op.like
    }

    // Si el usuario seleccionó una categoría, filtramos por ID
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where: whereClause, // <--- Aplicamos el filtro aquí
      include: [{ model: Category, attributes: ["name"] }],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error); // Es bueno ver el error en consola
    res.status(500).json({ message: "Error al obtener productos." });
  }
};

// 3. Obtener uno por ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, attributes: ["name"] }],
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto." });
  }
};

// 4. Actualizar producto
export const updateProduct = async (req: any, res: Response) => {
  const { id } = req.params;
  // Ahora recibimos 'video' y los demás datos del FormData
  const { name, description, price, stock, categoryId, video } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Lógica inteligente para la imagen:
    // Si subieron una nueva (req.file existe), usamos esa ruta.
    // Si NO subieron nueva, mantenemos la que ya tenía (product.image).
    const imagePath = req.file
      ? `uploads/${req.file.filename}`
      : product.dataValues.image;

    // Actualizamos los campos
    await product.update({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId,
      image: imagePath,
      video: video || null, // Si envían vacío, guardamos null
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
};

// 5. Eliminar producto
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedRows = await Product.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto." });
  }
};
