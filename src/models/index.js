"use strict";

const User = require("./User");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const Product = require("./Product");

// User -> Order: One-to-Many
User.hasMany(Order, {
  foreignKey: "userId",
  as: "Orders", // Changed to match the query
  onDelete: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "User", // Capitalized for consistency
});

// User -> Review: One-to-Many
User.hasMany(Review, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "Reviews", // Capitalized for consistency
});

Review.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

// Order -> OrderItem: One-to-Many
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  as: "Items", // Capitalized for consistency
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "Order",
});

// Product -> OrderItem: One-to-Many
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "OrderItems", // Capitalized for consistency
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "Product",
});

// Product -> Review: One-to-Many
Product.hasMany(Review, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  as: "Reviews",
});

Review.belongsTo(Product, {
  foreignKey: "productId",
  as: "Product",
});

module.exports = {
  User,
  Order,
  OrderItem,
  Review,
  Product,
};
