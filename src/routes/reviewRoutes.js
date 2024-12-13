"use strict";

const express = require("express");

const protect = require("../middleware/protect.js");
const {
  createReview,
  getProductReviews,
} = require("../controllers/rewiewController.js");

const reviewRouter = express.Router();

reviewRouter.post("/review/:productId", protect, createReview);

reviewRouter.get("/:productId", protect, getProductReviews);

module.exports = reviewRouter;
