"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const userByToken = require("../utils/userByToken.js");
const handleResponse = require("../utils/handleResponse.js");

const { getProductByIdService } = require("../services/productService.js");
const {
  createReviewService,
  getAllProductReviewService,
  calcAverageRatings,
  getReviewByIdService,
  updateProductService,
  deleteProductService,
} = require("../services/reviewService.js");

// Create a new review
const createReview = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");

  const { rating, review } = req.body;
  const productId = req.params.productId;

  if (!productId || !rating || !review)
    return handleResponse(res, 400, "Invalid inputs");

  // Check if the product exists
  const product = await getProductByIdService(productId);

  if (!product) {
    return handleResponse(res, 404, "Product not available.");
  }

  // Ensure the user hasn't already reviewed this product
  const existingReview = await getReviewByIdService(productId, currentUser.id);

  if (existingReview) {
    return handleResponse(res, 400, "You can only review a product once.");
  }

  // Create the new review
  const newReview = await createReviewService(
    productId,
    currentUser.id,
    rating,
    review
  );

  // Calculate the average rating for the product
  await calcAverageRatings(productId);

  return handleResponse(res, 201, "Review successful.", newReview);
});

// Get all reviews for a product
const getProductReviews = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await getProductByIdService(productId);

  if (!product) {
    return handleResponse(res, 404, "Product not available.");
  }

  const sanitizedReviews = await getAllProductReviewService(productId);

  handleResponse(res, 200, "Reviews fetched successfully.", sanitizedReviews);
});

// Get a single review for a product
const getProductReview = catchAsync(async (req, res, next) => {
  const { productId, reviewId } = req.params;

  const review = await getReviewByIdService(productId, reviewId);

  if (!review) {
    return handleResponse(res, 404, "Review not found.");
  }

  handleResponse(res, 200, "Review fetched successfully.", review);
});

// Update a review for a product
const updateProductReview = catchAsync(async (req, res, next) => {
  const { rating, review } = req.body;
  const { productId, reviewId } = req.params;
  const product = await getProductByIdService(productId);

  if (!product) {
    return handleResponse(res, 404, "Product not found.");
  }

  const exitstingReview = await getReviewByIdService(productId, reviewId);

  if (!exitstingReview) {
    return handleResponse(res, 404, "Review not found.");
  }

  const updatedReview = await updateProductService(reviewId, rating, review);

  if (!updatedReview) {
    return handleResponse(res, 404, "Review not found.");
  }

  // Recalculate the average rating for the product
  await calcAverageRatings(productId);

  handleResponse(res, 200, "Review updated successfully.", updatedReview);
});

// Delete a review for a product
const deleteProductReview = catchAsync(async (req, res, next) => {
  const { productId, reviewId } = req.params;

  const deletedReview = await deleteProductService(reviewId);

  if (!deletedReview) {
    return handleResponse(res, 404, "Review not found.");
  }

  // Recalculate the average rating for the product
  await calcAverageRatings(productId);

  handleResponse(res, 204);
});

module.exports = {
  createReview,
  getProductReviews,
  getProductReview,
  updateProductReview,
  deleteProductReview,
};
