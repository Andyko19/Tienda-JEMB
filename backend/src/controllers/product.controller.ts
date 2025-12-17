import type { Request, Response } from "express";
import Product from "../database/models/product.model.js";
import Category from "../database/models/category.model.js";

// 1. Crear producto (Con corrección req: any para la imagen)
export const createProduct = async (req: any, res: Response) => {
  const imagePath = req.file ? req.file.path : null;
  const { name, description, price, stock, categoryId } = req.body;

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
      image: imagePath,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto." });
  }
};

// 2. Obtener todos (Renombrado para coincidir con tus rutas)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ["name"] }],
    });
    res.status(200).json(products);
  } catch (error) {
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
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId } = req.body;

  try {
    const [updatedRows] = await Product.update(
      { name, description, price, stock, categoryId },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const updatedProduct = await Product.findByPk(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
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
