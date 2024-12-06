"use strict";

const Product = require("./Product.js");
const User = require("./User.js");
const Review = require("./Review.js");

function setupAssociations() {
  // Associations
  Review.belongsTo(Product, {
    foreignKey: {
      name: "productId",
      allowNull: false,
    },
    as: "product",
  });

  Review.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    as: "user",
  });
}

module.exports = setupAssociations;
