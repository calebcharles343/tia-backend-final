const sequelize = require("../config/db");
const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

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

const createReviewService = async (productId, userId, rating, review) => {
  const newReview = await Review.create({
    userId,
    productId,
    rating,
    review,
  });

  return newReview;
};

const getAllProductReviewService = async (productId) => {
  const reviews = await Review.findAll({
    where: { productId: productId },
    include: [{ model: User, as: "user" }],
  });

  const sanitizedReviews = reviews.map((review) => {
    const { id, name, avatar } = review.user;
    return { ...review.toJSON(), user: { id, name, avatar } };
  });

  return sanitizedReviews;
};

const getReviewByIdService = async (productId, userId) => {
  const review = await Review.findOne({
    where: { productId, userId },
  });
  return review;
};

const updateProductReviewService = async (reviewId, rating, review) => {
  const updatedReview = await Review.update(
    { rating, review },
    { where: { id: reviewId }, returning: true, plain: true }
  );

  return updatedReview[1];
};

const deleteProductReviweService = async (reviewId) => {
  const deletedReview = await Review.destroy({
    where: { id: reviewId },
  });

  return deletedReview;
};

module.exports = {
  createReviewService,
  getAllProductReviewService,
  calcAverageRatings,
  getReviewByIdService,
  updateProductReviewService,
  deleteProductReviweService,
};
