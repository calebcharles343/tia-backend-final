"use strict";

const express = require("express");

const {
  createOrder,
  getUserOrders,
  orderStatus,
  updateOrderStatus,
} = require("../controllers/0rderController.js");
const protect = require("../middleware/protect.js");

const orderRouter = express.Router();

orderRouter.post("/:id", protect, createOrder);

orderRouter.get("/:id", protect, getUserOrders);

orderRouter.patch(
  "/:id",
  protect,
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);

module.exports = orderRouter;
