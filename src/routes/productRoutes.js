"use strict";

const express = require("express");
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} = require("../controllers/productController.js");
const protect = require("../middleware/protect.js");
const restrictTo = require("../middleware/restrictTo.js");

const productRouter = express.Router();

productRouter.post("/", protect, restrictTo("Admin"), createProduct);

productRouter.get("/", protect, getAllProducts);

productRouter.get("/:productId", protect, getProductById);

productRouter.patch("/:productId", protect, restrictTo("Admin"), updateProduct);

productRouter.delete(
  "/:productId",
  protect,
  restrictTo("Admin"),
  deleteProduct
);

module.exports = productRouter;
