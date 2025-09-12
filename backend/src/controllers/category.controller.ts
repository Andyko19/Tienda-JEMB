import type { Request, Response } from "express";
import Category from "../database/models/category.model.js";

// Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías." });
  }
};

// Crear una nueva categoría (solo para Admin)
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "El nombre es requerido." });
  }

  try {
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la categoría." });
  }
};

// Actualizar una categoría (solo para Admin)
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [updatedRows] = await Category.update({ name }, { where: { id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }
    res.status(200).json({ message: "Categoría actualizada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la categoría." });
  }
};

// Eliminar una categoría (solo para Admin)
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRows = await Category.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }
    res.status(200).json({ message: "Categoría eliminada correctamente." });
  } catch (error) {
    // Podríamos tener un error si un producto todavía usa esta categoría
    res.status(500).json({
      message:
        "Error al eliminar la categoría. Asegúrate de que no esté en uso.",
    });
  }
};
