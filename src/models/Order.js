import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import OrderItem from "./OrderItem.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      // Updated to camelCase for consistency
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Updated to match table name
        key: "id",
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // Ensure total price is non-negative
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "orders",
    timestamps: false, // Keep timestamps for better tracking
    indexes: [
      { fields: ["userId"] }, // Index for user-specific queries
      { fields: ["status"] }, // Index for filtering by status
    ],
  }
);

// Associations

// Order -> OrderItems
Order.hasMany(OrderItem, {
  foreignKey: { name: "orderId", allowNull: false },
  onDelete: "CASCADE",
  as: "items",
});
OrderItem.belongsTo(Order, {
  foreignKey: { name: "orderId", allowNull: false },
  onDelete: "CASCADE",
  as: "order",
});

export default Order;
