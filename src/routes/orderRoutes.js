"use strict";

const express = require("express");

const {
  createOrder,
  getUserOrders,
  getUserOrderById,
  getAllAdminOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController.js");
const protect = require("../middleware/protect.js");
const orderStatus = require("../middleware/orderStatus.js");
const restrictTo = require("../middleware/restrictTo.js");

const orderRouter = express.Router();

orderRouter.post("/create", protect, createOrder);

orderRouter.get("/", protect, getUserOrders);
orderRouter.get(
  "/administrator",
  protect,
  restrictTo("Admin"),
  getAllAdminOrders
);
orderRouter.get("/:id", protect, getUserOrderById);

// orderRouter.get("/admin", protect, restrictTo("Admin"), getAllAdminOrders);

orderRouter.patch(
  "/updateOrderStatus/:orderId",
  protect,
  restrictTo("Admin"),
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);
orderRouter.patch(
  "/cancel/:orderId",
  protect,
  orderStatus("cancelled"),
  updateOrderStatus
);

orderRouter.delete("/delete/:orderId", protect, deleteOrder);

module.exports = orderRouter;
