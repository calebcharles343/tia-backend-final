"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

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
      type: DataTypes.TEXT,
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
        min: 0,
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
        min: 0,
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
    indexes: [{ fields: ["name"] }, { fields: ["category"] }],
  }
);

module.exports = Product;
