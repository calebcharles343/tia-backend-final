"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const Order = require("../models/Order.js");
const OrderItem = require("../models/OrderItem.js");
const Product = require("../models/Product.js");
const {
  createOrderService,
  getUserOrdersSevice,
  getOrderByIdSevice,
  updateOrderStatusSevice,
} = require("../services/orderService.js");
const AppError = require("../utils/appError.js");
const handleResponse = require("../utils/handleResponse.js");

// Create a new order
const createOrder = catchAsync(async (req, res, next) => {
  const { items } = req.body; // Array of { productId, quantity }

  // Validate that items array is not empty
  if (!items || items.length === 0) {
    return handleResponse(res, 400, "No items provided for the order");
  }

  const order = await createOrderService(items);

  handleResponse(res, 201, "Order created successfully", order);
});

// Get all orders of the authenticated user
const getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await getUserOrdersSevice();

  handleResponse(res, 200, "orders fetched successfully", orders);
});

// Update order status (e.g., admin functionality)
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await getOrderByIdSevice(req.params.id);
  if (!order) {
    handleResponse(res, 404, "Order not found");
  }
  const orderStatusUpdated = await updateOrderStatusSevice(order, status);
  handleResponse(res, 200, `order ${status}`, orderStatusUpdated);
});

module.exports = {
  createOrder,
  getUserOrders,
  updateOrderStatus,
};
