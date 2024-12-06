"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js"); // Your Sequelize instance
const Order = require("./Order.js");
const Review = require("./Review.js");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      defaultValue: "User",
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      field: "password_changed_at",
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      field: "password_reset_token",
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      field: "password_reset_expires",
    },
  },
  {
    tableName: "users",
    timestamps: true, // Enable timestamps for auditing
    indexes: [
      { unique: true, fields: ["email"] }, // Index for faster lookups
    ],
  }
);

// Associations

// User -> Order
User.hasMany(Order, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
  as: "userOrders",
});

Order.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
  as: "user",
});

// User -> Review
User.hasMany(Review, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
  as: "userReviews",
});

Review.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
  as: "user",
});

module.exports = User;
