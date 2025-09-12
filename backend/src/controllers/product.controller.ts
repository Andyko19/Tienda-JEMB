import type { Request, Response } from "express";
import Product from "../database/models/product.model.js";
import Category from "../database/models/category.model.js";

// Crear un nuevo producto (solo para Admin)
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId } = req.body;

  if (!name || !description || !price || !stock || !categoryId) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    // Verificamos que la categoría exista
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ message: "La categoría especificada no existe." });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error al crear el producto." });
  }
};

// Obtener todos los productos (Público, con paginación y filtros)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"], // Incluimos el nombre de la categoría en la respuesta
        },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos." });
  }
};

// Obtener un producto por su ID (Público)
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

// Actualizar un producto (solo para Admin)
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
    res.status(500).json({ message: "Error al actualizar el producto." });
  }
};

// Eliminar un producto (solo para Admin)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRows = await Product.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto." });
  }
};
