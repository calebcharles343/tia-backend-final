"use strict";

const express = require("express");

const protect = require("../middleware/protect.js");
const {
  createReview,
  getProductReviews,
  getProductReview,
  updateProductReview,
  deleteProductReview,
} = require("../controllers/rewiewController.js");

const reviewRouter = express.Router();

reviewRouter.post("/create/:productId", protect, createReview);
reviewRouter.patch(
  "/update/:productId/:reviewId",
  protect,
  updateProductReview
);
reviewRouter.delete(
  "/delete/:productId/:reviewId",
  protect,
  deleteProductReview
);

reviewRouter.get("/:productId", protect, getProductReviews);
reviewRouter.get("/:productId/:reviewId", protect, getProductReview);

module.exports = reviewRouter;
