const AppError = require("../utils/appError");
const { User, Order, OrderItem, Product } = require("../models/index");
const { createCheckoutSession } = require("../services/paymentService");

const getUserOrderByIdSevice = async (userId, id) => {
  const order = await Order.findAll({
    where: { id: id, userId: userId },
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
  return order;
};

const createOrderAndPaymentSession = async (userId, items) => {
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
  const orderItems = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new AppError(`Product with ID ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for product ID ${item.productId}`);
    }

    const pricePerItem = parseFloat(product.price); // Get price from the database
    const itemTotal = item.quantity * pricePerItem;
    totalPrice += itemTotal;

    // Deduct quantity from product stock using decrement
    await product.decrement("stock", { by: item.quantity });

    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      pricePerItem, // Include price fetched from the database
    });
  }

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

  // Fetch the detailed order to get nested structure
  const detailedOrder = await getUserOrderByIdSevice(userId, order.id);

  // Prepare checkout items for Stripe
  const checkoutItems = detailedOrder[0].Items.map((orderItem) => {
    const product = orderItem.Product;
    return {
      name: product.name,
      description: product.description,
      price: Math.round(orderItem.pricePerItem * 100), // Convert to cents and round
      quantity: orderItem.quantity,
    };
  });

  // Create a Stripe checkout session
  const session = await createCheckoutSession(
    checkoutItems,
    `${process.env.BASE_URL}orders`,
    `${process.env.BASE_URL}cartPage`
  );

  // Return the order and session details
  return { order, session };
};

const getAllAdminOrdersService = async () => {
  const orders = await Order.findAll({
    include: [
      {
        model: User,
        as: "User",
      },
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
  const order = await Order.findOne({
    where: { id },
    include: [
      {
        model: OrderItem,
        as: "Items",
        include: [
          {
            model: Product,
            as: "Product",
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new AppError(`Order with ID ${id} not found`);
  }

  if (order.status === "pending") {
    throw new AppError(
      `Order still pending! Please cancel order before deletion`
    );
  }

  // Increment product stock for each order item if the order is cancelled
  if (order.status === "cancelled") {
    for (const item of order.Items) {
      const product = item.Product;

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`);
      }

      await product.increment("stock", { by: item.quantity });
    }
  }

  // Delete the order and associated items
  await OrderItem.destroy({ where: { orderId: id } });
  await Order.destroy({ where: { id } });

  return order;
};

module.exports = {
  getAllAdminOrdersService,
  getUserOrderByIdSevice,
  createOrderAndPaymentSession,
  getUserOrdersSevice,
  getOrderByIdSevice,
  updateOrderStatusSevice,
  deleteOrderSevice,
};
