import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createOrder,
  getUserOrders,
  orderStatus,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/:id", protect, createOrder);

orderRouter.get("/:id", protect, getUserOrders);

orderRouter.patch(
  "/:id",
  protect,
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);

export default orderRouter;
