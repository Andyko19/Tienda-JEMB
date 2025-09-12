import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import db from "../connection.js";

// Interfaz para los atributos de la categoría
export interface CategoryAttributes {
  id: string;
  name: string;
}

// Interfaz para la creación, haciendo el 'id' opcional
export type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    tableName: "categories",
    timestamps: false, // Generalmente las categorías no necesitan timestamps
  }
);

export default Category;
