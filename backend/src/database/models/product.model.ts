import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import db from "../connection.js";
import Category from "./category.model.js";

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
  // USAMOS 'declare' PARA QUE SEQUELIZE FUNCIONE BIEN
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare stock: number;
  declare categoryId: string;
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
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
        model: Category,
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

// Definir relaciones
// Nota: Es posible que necesites mover esto a un archivo de asociaciones central si tienes problemas de importación circular,
// pero por ahora mantenlo así si no ha dado error de importación.
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

export default Product;
