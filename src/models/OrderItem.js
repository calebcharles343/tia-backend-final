"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    pricePerItem: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
    indexes: [{ fields: ["orderId"] }, { fields: ["productId"] }],
  }
);

module.exports = OrderItem;
