import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controllers/reviewController";

const reviewRouter = express.Router();

reviewRouter.post("/:id", protect, createReview);

reviewRouter.get("/:id", protect, getProductReviews);

export default reviewRouter;
