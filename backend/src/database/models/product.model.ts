import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import db from "../connection.js";
import Category from "./category.model.js"; // Importamos el modelo de categoría

export interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export type ProductCreationAttributes = Optional<ProductAttributes, "id">;

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public categoryId!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Usamos TEXT para descripciones largas
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // 10 dígitos en total, 2 para decimales
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category, // Establece la relación
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    tableName: "products",
    timestamps: true,
  }
);

// Definimos la relación formalmente
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

export default Product;
