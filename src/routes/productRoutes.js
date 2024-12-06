import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", protect, restrictTo("Admin"), createProduct);

productRouter.get("/", protect, getAllProducts);

productRouter.get("/:id", protect, getProductById);

productRouter.patch("/:id", protect, restrictTo("Admin"), updateProduct);

productRouter.delete("/:id", protect, restrictTo("Admin"), deleteProduct);

export default productRouter;