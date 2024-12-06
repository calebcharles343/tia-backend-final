import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { handleResponse } from "../utils/handleResponse.js";

// Create a new order
export const createOrder = catchAsync(async (req, res, next) => {
  const { items } = req.body; // Array of { productId, quantity, pricePerItem }

  const order = await Order.create({
    userId: req.params.id,
    totalPrice: items.reduce(
      (total, item) => total + item.quantity * item.pricePerItem,
      0
    ),
    status: "pending",
  });

  for (const item of items) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      pricePerItem: item.pricePerItem,
    });
  }

  handleResponse(res, 201, "order created successfully", order);
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
