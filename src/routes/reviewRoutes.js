"use strict";

const express = require("express");

const protect = require("../middleware/protect.js");
const {
  createReview,
  getProductReviews,
  getProductReview,
  updateProductReview,
  deleteProductReview,
} = require("../controllers/reviewController.js");

const reviewRouter = express.Router();

reviewRouter.post("/review/:productId", protect, createReview);
reviewRouter.patch(
  "/review/:productId/:reviewId",
  protect,
  updateProductReview
);
reviewRouter.delete(
  "/review/:productId/:reviewId",
  protect,
  deleteProductReview
);

reviewRouter.get("/:productId", protect, getProductReviews);
reviewRouter.get("/review/:productId/:reviewId", protect, getProductReview);

module.exports = reviewRouter;
