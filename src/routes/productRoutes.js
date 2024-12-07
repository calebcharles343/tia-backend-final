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

productRouter.get("/:id", protect, getProductById);

productRouter.patch("/:id", protect, restrictTo("Admin"), updateProduct);

productRouter.delete("/:id", protect, restrictTo("Admin"), deleteProduct);

module.exports = productRouter;
