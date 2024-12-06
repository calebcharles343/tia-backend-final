import express from "express";
import { protect } from "../controllers/authController";
import { getProductReviews } from "../controllers/reviewController";

const reviewRouter = express.Router();

reviewRouter.post("/:id", protect, createReviee);

reviewRouter.get("/:id", protect, getProductReviews);

export default reviewRouter;
