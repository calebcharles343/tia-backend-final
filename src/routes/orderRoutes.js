"use strict";

const express = require("express");

const {
  createOrder,
  getUserOrders,
  getAllAdminOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController.js");
const protect = require("../middleware/protect.js");
const orderStatus = require("../middleware/orderStatus.js");
const restrictTo = require("../middleware/restrictTo.js");

const orderRouter = express.Router();

orderRouter.post("/create", protect, createOrder);

orderRouter.get("/", protect, getUserOrders);

orderRouter.get("/admin", protect, restrictTo("Admin"), getAllAdminOrders);

orderRouter.patch(
  "/update/:orderId",
  protect,
  restrictTo("Admin"),
  orderStatus("pending", "completed", "cancelled"),
  updateOrderStatus
);
orderRouter.patch(
  "/cancel/:orderId",
  protect,
  orderStatus("cancelled"),
  updateOrderStatus
);

orderRouter.delete("/delete/:orderId", protect, deleteOrder);

module.exports = orderRouter;

/*"use strict";

const express = require('express');
const router = express.Router();
const orderPaymentService = require('../services/orderPaymentService');

router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;
    const result = await orderPaymentService.createOrderWithPayment(userId, items);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await orderPaymentService.handlePaymentSuccess(session.id);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; */
