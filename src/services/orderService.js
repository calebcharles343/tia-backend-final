"use strict";

const AppError = require("../utils/appError.js");
const { Order, OrderItem, Product } = require("../models/index.js");

const createOrderService = async (userId, items) => {
  // Fetch product details from the database
  const productIds = items.map((item) => item.productId);
  const products = await Product.findAll({
    where: { id: productIds },
  });

  // Check if all requested products exist
  if (products.length !== items.length) {
    throw new AppError("Some products are not found");
  }

  // Calculate total price and create order items
  let totalPrice = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new AppError(`Product with ID ${item.productId} not found`);
    }

    const pricePerItem = product.price; // Get price from the database
    const itemTotal = item.quantity * pricePerItem;
    totalPrice += itemTotal;

    return {
      productId: item.productId,
      quantity: item.quantity,
      pricePerItem, // Include price fetched from the database
    };
  });

  // Create the order
  const order = await Order.create({
    userId: userId,
    totalPrice,
    status: "pending",
  });

  // Save order items
  for (const orderItem of orderItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      pricePerItem: orderItem.pricePerItem,
    });
  }

  return order;
};

const getUserOrdersSevice = async (userId) => {
  const orders = await Order.findAll({
    where: { userId: userId },
    include: [
      {
        model: OrderItem,
        as: "Items", // Match alias defined in model
        include: [
          {
            model: Product,
            as: "Product", // Match alias defined in model
          },
        ],
      },
    ],
  });

  return orders;
};

const getOrderByIdSevice = async (id) => {
  const order = await Order.findByPk(id);
  return order;
};

const updateOrderStatusSevice = async (order, status) => {
  order.status = status;
  await order.save();
  return order;
};

const deleteOrderSevice = async (id) => {
  const order = await Order.findOne({ where: { id } });
  if (!order) {
    throw new AppError(`Order with ID ${id} not found`);
  }
  await Order.destroy({ where: { id } });
  return order;
};

module.exports = {
  createOrderService,
  getUserOrdersSevice,
  getOrderByIdSevice,
  updateOrderStatusSevice,
  deleteOrderSevice,
};
