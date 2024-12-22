"use strict";

const orderService = require("./orderService");
const paymentService = require("./paymentService");
const { Order } = require("../models");

class OrderPaymentService {
  async createOrderWithPayment(userId, items) {
    try {
      // Create order first
      const order = await orderService.createOrder(userId, items);

      // Create checkout session for the order
      const checkoutItems = items.map((item) => ({
        name: item.product.name,
        description: item.product.description,
        price: item.pricePerItem,
        quantity: item.quantity,
      }));

      const session = await paymentService.createCheckoutSession(
        checkoutItems,
        `${process.env.BASE_URL}/orders/${order.id}/success`,
        `${process.env.BASE_URL}/orders/${order.id}/cancel`
      );

      // Update order with session ID
      await Order.update(
        { stripeSessionId: session.id },
        { where: { id: order.id } }
      );

      return {
        order,
        sessionId: session.id,
      };
    } catch (error) {
      throw new Error(`Order payment creation failed: ${error.message}`);
    }
  }

  async handlePaymentSuccess(sessionId) {
    try {
      const order = await Order.findOne({
        where: { stripeSessionId: sessionId },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      await Order.update({ status: "completed" }, { where: { id: order.id } });

      return order;
    } catch (error) {
      throw new Error(`Payment success handling failed: ${error.message}`);
    }
  }
}

module.exports = new OrderPaymentService();

/*
"use strict";

const { Order, OrderItem, Product } = require('../models');

class OrderService {
  async createOrder(userId, items) {
    try {
      // Calculate total price
      let totalPrice = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        totalPrice += product.price * item.quantity;
      }

      // Create order
      const order = await Order.create({
        userId,
        totalPrice,
        status: 'pending'
      });

      // Create order items
      await Promise.all(
        items.map(item =>
          OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            pricePerItem: item.price
          })
        )
      );

      // Return order with items
      return Order.findByPk(order.id, {
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });
    } catch (error) {
      throw new Error(`Order creation failed: ${error.message}`);
    }
  }
}

module.exports = new OrderService();
*/
