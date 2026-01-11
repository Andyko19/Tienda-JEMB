import { Request, Response } from "express";
import Product from "../database/models/product.model.js";
import { v4 as uuidv4 } from "uuid";
import Category from "../database/models/category.model.js";
import { Op } from "sequelize";

// 1. Obtener todos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.query;
    const whereClause: any = {};

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` }; // O Op.iLike si usas Postgres
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [{ model: Category, attributes: ["name"] }],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// 2. Obtener por ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, attributes: ["name"] }],
    });
    if (!product) return res.status(404).json({ message: "No encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// 3. Crear Producto
export const createProduct = async (req: any, res: Response) => {
  // Nota: req.files viene de Multer. Usamos 'any' en req para evitar errores de TS si faltan tipos.
  const { name, description, price, stock, categoryId, video, image } =
    req.body;
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  try {
    // IMAGEN: ¿Viene archivo o link?
    const imageFile = files["image"]?.[0];
    const imagePath = imageFile ? `uploads/${imageFile.filename}` : image || "";

    // VIDEO: ¿Viene archivo o link?
    const videoFile = files["video"]?.[0];
    const videoPath = videoFile
      ? `uploads/${videoFile.filename}`
      : video || null;

    const newProduct = await Product.create({
      id: uuidv4(),
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId,
      image: imagePath,
      video: videoPath,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// 4. Actualizar Producto
export const updateProduct = async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId, video, image } =
    req.body;
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "No encontrado." });

    // Actualizar Imagen
    let finalImage = product.dataValues.image;
    if (files["image"]?.[0]) {
      finalImage = `uploads/${files["image"][0].filename}`;
    } else if (image !== undefined && image !== null) {
      // Solo actualizamos si envían algo distinto de null/undefined
      // Si envían string vacío, significa que quieren borrar la foto o poner un link vacío
      if (image.trim() !== "") finalImage = image;
    }

    // Actualizar Video
    let finalVideo = product.dataValues.video;
    if (files["video"]?.[0]) {
      finalVideo = `uploads/${files["video"][0].filename}`;
    } else if (video !== undefined && video !== null) {
      if (video.trim() !== "") finalVideo = video;
    }

    await product.update({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId,
      image: finalImage,
      video: finalVideo,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ message: "Error al actualizar" });
  }
};

// 5. Eliminar
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "No encontrado" });
    await product.destroy();
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
