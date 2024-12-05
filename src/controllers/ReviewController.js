import Review from "../models/Reviews.js";
import Product from "../models/products.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;

    // Ensure the user hasn't already reviewed this product
    const existingReview = await Review.findOne({
      where: { productId, userId: req.user.id },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You can only review a product once." });
    }

    const newReview = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      review,
    });

    // Calculate the average rating for the product
    await Review.calcAverageRatings(productId);

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, as: "user" }],
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
