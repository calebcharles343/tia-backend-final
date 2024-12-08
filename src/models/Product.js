"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const Review = require("./Review.js");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Product name cannot be empty.",
        },
      },
    },
    description: {
      type: DataTypes.TEXT, // Allow longer descriptions
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Product description cannot be empty.",
        },
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Product category cannot be empty.",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // Ensure price is non-negative
      },
    },

    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // Ensure stock is non-negative
      },
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "ratings_quantity",
    },
    ratingAverage: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
      field: "ratings_average",
    },
  },
  {
    tableName: "products",
    timestamps: true,
    indexes: [
      { fields: ["name"] }, // Updated index field
      { fields: ["category"] }, // Add index for category for filtering
    ],
  }
);

// Associations

// Product -> Review
Product.hasMany(Review, {
  foreignKey: { name: "productId", allowNull: false },
  onDelete: "CASCADE", // Ensure reviews are deleted when product is deleted
  as: "reviews",
});

Review.belongsTo(Product, {
  foreignKey: { name: "productId", allowNull: false },
  onDelete: "CASCADE",
  as: "product",
});

module.exports = Product;
