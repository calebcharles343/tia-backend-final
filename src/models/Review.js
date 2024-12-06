import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Review extends Model {
  // Static method to calculate average ratings
  static async calcAverageRatings(productId) {
    const stats = await Review.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("rating")), "nRating"],
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      ],
      where: { productId },
      raw: true,
    });

    const { nRating = 0, avgRating = 4.5 } = stats[0] || {};

    const Product = (await import("./Product.js")).default; // Dynamic import
    await Product.update(
      {
        ratingsQuantity: nRating,
        ratingsAverage: avgRating,
      },
      { where: { id: productId } }
    );
  }
}

Review.init(
  {
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
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews", // Explicit table name for clarity
    timestamps: true, // Enable createdAt/updatedAt
    paranoid: true, // Enable soft deletes
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

// Associations (to be defined in their respective models):
// 1. Review -> Product
// 2. Review -> User

export default Review;
