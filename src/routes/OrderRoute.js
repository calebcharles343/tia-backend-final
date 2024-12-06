import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createOrder,
  getUserOrders,
  orderStatus,
  updateOrderStatus,
} from "../controllers/OrderController.js";

const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);

orderRouter.get("/:id", protect, getUserOrders);

orderRouter.patch(
  "/:id",
  protect,
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);
// orderRouter.get("/:id", protect, getProductById);

// orderRouter.delete("/:id", protect, restrictTo("Admin"), deleteProduct);

export default orderRouter;
