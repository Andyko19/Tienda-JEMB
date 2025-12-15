import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import db from "../connection.js";
import Order from "./order.model.js";
import Product from "./product.model.js";

interface OrderItemAttributes {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
}

interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id"> {}

class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  declare id: string;
  declare quantity: number;
  declare price: number;
  declare orderId: string;
  declare productId: string;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    tableName: "order_items",
    timestamps: false,
  }
);

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

export default OrderItem;
