import Product from "./Product.js";
import User from "./User.js";
import Review from "./Review.js";

export default function setupAssociations() {
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
