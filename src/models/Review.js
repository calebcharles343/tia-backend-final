"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Review = sequelize.define(
  "Review",
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Review content cannot be empty.",
        },
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "Rating must be at least 1.",
        },
        max: {
          args: 5,
          msg: "Rating cannot exceed 5.",
        },
      },
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["productId", "userId"],
      },
      { fields: ["productId"] },
      { fields: ["userId"] },
    ],
  }
);

module.exports = Review;
