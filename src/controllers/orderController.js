"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const userByToken = require("../utils/userByToken.js");

const {
  createOrderService,
  getUserOrdersSevice,
  getOrderByIdSevice,
  updateOrderStatusSevice,
  deleteOrderSevice,
  getAllAdminOrdersService,
} = require("../services/orderService.js");

const handleResponse = require("../utils/handleResponse.js");

// Create a new order
const createOrder = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");

  const { items } = req.body; // Array of { productId, quantity }
  const userId = currentUser.id;

  // Validate that items array is not empty
  if (!items || items.length === 0) {
    return handleResponse(res, 400, "No items provided for the order");
  }

  const order = await createOrderService(userId, items);

  handleResponse(res, 201, "Order created successfully", order);
});

// Get all orders for Admin =
const getAllAdminOrders = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");

  const orders = await getAllAdminOrdersService();

  handleResponse(res, 200, "Admin orders fetched successfully", orders);
});
// Get all orders of the authenticated user
const getUserOrders = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");
  const userId = currentUser.id;

  const orders = await getUserOrdersSevice(userId);

  handleResponse(res, 200, "orders fetched successfully", orders);
});

// Update order status (e.g., admin functionality)
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await getOrderByIdSevice(req.params.orderId);
  if (!order) {
    handleResponse(res, 404, "Order not found");
  }
  const orderStatusUpdated = await updateOrderStatusSevice(order, status);
  handleResponse(res, 200, `order ${status}`, orderStatusUpdated);
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await getOrderByIdSevice(req.params.orderId);

  if (!order) {
    return handleResponse(res, 404, "Order not found");
  }

  await deleteOrderSevice(req.params.orderId);
  handleResponse(res, 204);
});

module.exports = {
  createOrder,
  getAllAdminOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
};
