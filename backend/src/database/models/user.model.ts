import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import db from "../connection.js";

export interface UserAttributes {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password?: string | null;
  provider: "local" | "google";
  providerId?: string | null;
  role: "customer" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define un nuevo tipo para los atributos de CREACIÓN.
//    Hacemos opcionales los campos que Sequelize genera automáticamente o que tienen un valor por defecto.
export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "provider" | "role" | "createdAt" | "updatedAt"
>;

// 3. Actualiza la definición de la clase para que use ambos tipos.
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public lastName!: string;
  public email!: string;
  public password!: string | null;
  public provider!: "local" | "google";
  public providerId!: string | null;
  public role!: "customer" | "admin";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM("local", "google"),
      allowNull: false,
      defaultValue: "local",
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("customer", "admin"),
      allowNull: false,
      defaultValue: "customer",
    },
  },
  {
    sequelize: db,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
