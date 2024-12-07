const sequelize = require("../config/db");
const Product = require("../models/Product");
const Review = require("../models/Review");

const calcAverageRatings = async (productId) => {
  const stats = await Review.findAll({
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("rating")), "nRating"],
      [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
    ],
    where: { productId },
    raw: true,
  });

  const { nRating = 0, avgRating = 4.5 } = stats[0] || {};

  const product = await Product.findByPk(productId);

  await product.update({
    ratingCount: nRating,
    ratingAverage: avgRating,
  });
};

module.exports = calcAverageRatings;
