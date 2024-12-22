"use strict";

const express = require("express");
const router = express.Router();
const paymentService = require("../services/paymentService");

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;
    const session = await paymentService.createCheckoutSession(
      items,
      `${req.protocol}://${req.get("host")}/payment/success`,
      `${req.protocol}://${req.get("host")}/payment/cancel`
    );
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
