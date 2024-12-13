"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const userByToken = require("../middleware/userByToken.js");
const Product = require("../models/Product.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
const calcAverageRatings = require("../services/reviewService.js");

// const Product = require("../models/products.js");
const handleResponse = require("../utils/handleResponse.js");

// Create a new review
const createReview = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");

  const { rating, review } = req.body;
  const productId = req.params.productId;

  if ((!productId, !rating, !review))
    return handleResponse(res, 404, "invalid inputs");

  // Check if the product exists
  const product = await Product.findOne({
    where: { id: productId },
  });

  if (!product) {
    return handleResponse(res, 404, "Product not available.");
  }

  if (!currentUser) {
    return handleResponse(res, 404, "User not found.");
  }

  // Ensure the user hasn't already reviewed this product
  const existingReview = await Review.findOne({
    where: { productId, userId: currentUser.id },
  });

  if (existingReview) {
    return handleResponse(res, 400, "You can only review a product once.");
  }

  // Create the new review
  const newReview = await Review.create({
    userId: currentUser.id,
    productId,
    rating,
    review,
  });

  // Calculate the average rating for the product
  await calcAverageRatings(productId);

  return handleResponse(res, 201, "Review successful.", newReview);
});

// Get all reviews for a product
const getProductReviews = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    where: { id: req.params.productId },
  });

  if (!product) {
    handleResponse(res, 404, "Product not available.");
  }

  const reviews = await Review.findAll({
    where: { productId: req.params.productId },
    include: [{ model: User, as: "user" }],
  });

  const sanitizedReviews = reviews.map((review) => {
    const { id, name, email, avatar } = review.user;
    return { ...review.toJSON(), user: { id, name, email, avatar } };
  });

  handleResponse(res, 201, "Reviews fetched successfully.", sanitizedReviews);
});

module.exports = {
  createReview,
  getProductReviews,
};
