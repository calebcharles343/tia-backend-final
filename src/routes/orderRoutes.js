"use strict";

const express = require("express");

const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require("../controllers/orderController.js");
const protect = require("../middleware/protect.js");
const orderStatus = require("../middleware/orderStatus.js");

const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);

orderRouter.get("/", protect, getUserOrders);

orderRouter.patch(
  "/:orderId",
  protect,
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);

module.exports = orderRouter;
