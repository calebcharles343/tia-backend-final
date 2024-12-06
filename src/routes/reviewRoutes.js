"use strict";

const express = require("express");

const protect = require("../middleware/protect.js");
const {
  createReview,
  getProductReviews,
} = require("../controllers/rewiewController.js");

const reviewRouter = express.Router();

reviewRouter.post("/:id", protect, createReview);

reviewRouter.get("/:id", protect, getProductReviews);

module.exports = reviewRouter;
