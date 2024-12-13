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

productRouter.post("/create", protect, restrictTo("Admin"), createProduct);

productRouter.get("/", protect, getAllProducts);

productRouter.get("/:productId", protect, getProductById);

productRouter.patch(
  "/update/:productId",
  protect,
  restrictTo("admin"),
  updateProduct
);

productRouter.delete(
  "/delete/:productId",
  protect,
  restrictTo("Admin"),
  deleteProduct
);

module.exports = productRouter;
