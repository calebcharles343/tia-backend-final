"use strict";

const { DataTypes, models } = require("sequelize");
const sequelize = require("../config/db.js");

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reviews", // Explicit table name for clarity
    timestamps: true, // Enable createdAt/updatedAt
    paranoid: false, // Enable soft deletes if needed
    indexes: [
      {
        unique: true,
        fields: ["productId", "userId"], // User can review a product only once
      },
      {
        fields: ["productId"], // Optimize queries fetching reviews by product
      },
    ],
  }
);

// Associations

// Review -> Product
Review.associate = (models) => {
  // A review belongs to a single product
  Review.belongsTo(models.Product, {
    foreignKey: "productId",
    as: "product", // Alias for the association
    onDelete: "CASCADE", // Delete reviews when the product is deleted
  });

  // A review belongs to a single user
  Review.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user", // Alias for the association
    onDelete: "CASCADE", // Delete reviews when the user is deleted
  });
};

// Review.belongsTo(Product, {
//   foreignKey: "productId",
//   as: "product", // Alias for the association
//   onDelete: "CASCADE", // Delete reviews when the product is deleted
// });

// // Review -> User
// Review.belongsTo(User, {
//   foreignKey: "userId",
//   as: "user", // Alias for the association
//   onDelete: "CASCADE", // Delete reviews when the user is deleted
// });

module.exports = Review;
