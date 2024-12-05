import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import OrderItem from "./OrdersItems.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
  }
);

// Order to OrderItems
Order.hasMany(OrderItem, { foreignKey: "OrderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "OrderId", as: "order" });

export default Order;
