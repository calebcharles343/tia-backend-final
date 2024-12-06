import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { handleResponse } from "../utils/handleResponse.js";

// Create a new order
export const createOrder = catchAsync(async (req, res, next) => {
  const { items } = req.body; // Array of { productId, quantity }

  // Validate that items array is not empty
  if (!items || items.length === 0) {
    return handleResponse(res, 400, "No items provided for the order");
  }

  // Fetch product details from the database
  const productIds = items.map((item) => item.productId);
  const products = await Product.findAll({
    where: { id: productIds },
  });

  // Check if all requested products exist
  if (products.length !== items.length) {
    return handleResponse(res, 404, "Some products are not found");
  }

  // Calculate total price and create order items
  let totalPrice = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
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
    userId: req.params.id,
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

  handleResponse(res, 201, "Order created successfully", order);
});

// Get all orders of the authenticated user
export const getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { userId: req.params.id },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      },
    ],
  });

  handleResponse(res, 200, "orders fetched successfully", orders);
});

export const orderStatus = (...status) => {
  return (req, res, next) => {
    if (!status.includes(req.body.status)) {
      return next(
        new AppError(
          "Order status options only pending, completed or cancelled",
          403
        )
      );
    }

    next();
  };
};

// Update order status (e.g., admin functionality)
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    handleResponse(res, 404, "Order not found");
  }
  order.status = status;
  await order.save();
  res.status(200).json(order);

  handleResponse(res, 200, `order ${status}`, order);
});
