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

    const { nRating, avgRating } = stats[0] || { nRating: 0, avgRating: 4.5 };

    const Product = (await import("./Product.js")).default; // Import dynamically
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
          msg: "Review cannot be empty!",
        },
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
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
    indexes: [
      {
        unique: true,
        fields: ["productId", "userId"], // Ensures a user can review a product only once
      },
    ],
  }
);

export default Review;
