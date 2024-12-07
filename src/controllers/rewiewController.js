"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const Product = require("../models/Product.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
const calcAverageRatings = require("../services/reviewService.js");

// const Product = require("../models/products.js");
const handleResponse = require("../utils/handleResponse.js");

// Create a new review
const createReview = catchAsync(async (req, res, next) => {
  const { productId, rating, review } = req.body;

  // Check if the product exists
  const product = await Product.findOne({
    where: { id: productId },
  });

  if (!product) {
    return handleResponse(res, 404, "Product not available.");
  }

  // Check if the user exists
  const user = await User.findByPk(req.params.UserId);

  if (!user) {
    return handleResponse(res, 404, "User not found.");
  }

  // Ensure the user hasn't already reviewed this product
  const existingReview = await Review.findOne({
    where: { productId, userId: req.params.UserId },
  });

  if (existingReview) {
    return handleResponse(res, 400, "You can only review a product once.");
  }

  // Create the new review
  const newReview = await Review.create({
    userId: req.params.UserId,
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

  handleResponse(res, 201, "Reviews fetched successfully.", reviews);
});

module.exports = {
  createReview,
  getProductReviews,
};
