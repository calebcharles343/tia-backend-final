import Review from "../models/Reviews.js";
// import Product from "../models/products.js";
import { handleResponse } from "../utils/handleResponse.js";

// Create a new review
export const createReview = catchAsync(async (req, res, next) => {
  const { productId, rating, review } = req.body;

  // Ensure the user hasn't already reviewed this product
  const existingReview = await Review.findOne({
    where: { productId, userId: req.params.id },
  });

  if (existingReview) {
    handleResponse(res, 400, "You can only review a product once.");
  }

  const newReview = await Review.create({
    userId: req.params.id,
    productId,
    rating,
    review,
  });

  // Calculate the average rating for the product
  await Review.calcAverageRatings(productId);

  handleResponse(res, 201, "You can only review a product once.", newReview);
});

// Get all reviews for a product
export const getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.findAll({
    where: { productId: req.params.productId },
    include: [{ model: User, as: "user" }],
  });

  handleResponse(res, 201, "Review fetched successfully.", reviews);
});
