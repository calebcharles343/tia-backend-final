"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
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
    timestamps: true,
    indexes: [{ fields: ["userId"] }, { fields: ["status"] }],
  }
);

module.exports = Order;
