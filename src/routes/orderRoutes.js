"use strict";

const express = require("express");

const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController.js");
const protect = require("../middleware/protect.js");
const orderStatus = require("../middleware/orderStatus.js");
const restrictTo = require("../middleware/restrictTo.js");

const orderRouter = express.Router();

orderRouter.post("/order", protect, createOrder);

orderRouter.get("/", protect, getUserOrders);

orderRouter.patch(
  "/:orderId",
  protect,
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);

orderRouter.delete(
  "/delete/:orderId",
  protect,
  restrictTo("Admin"),
  deleteOrder
);

module.exports = orderRouter;
