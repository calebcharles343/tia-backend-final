import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Product from "./Product.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      // Updated to camelCase for consistency
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders", // Updated to match table name
        key: "id",
      },
    },
    productId: {
      // Updated to camelCase for consistency
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products", // Updated to match table name
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1, // Ensure quantity is at least 1
      },
    },
    pricePerItem: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0, // Ensure price is non-negative
      },
    },
  },
  {
    tableName: "order_items", // Updated table name for consistency with naming conventions
    timestamps: false,
    indexes: [
      { fields: ["orderId"] }, // Index for optimized lookups
      { fields: ["productId"] }, // Index for optimized lookups
    ],
  }
);

// Associations

// OrderItem -> Product
Product.hasMany(OrderItem, {
  foreignKey: { name: "productId", allowNull: false },
  onDelete: "CASCADE", // Ensures cleanup when product is deleted
  as: "orderItems",
});

OrderItem.belongsTo(Product, {
  foreignKey: { name: "productId", allowNull: false },
  onDelete: "CASCADE",
  as: "product",
});

export default OrderItem;
