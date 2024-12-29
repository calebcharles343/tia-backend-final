"use strict";

const express = require("express");
const { handleExpiredSession } = require("../services/webhookService");
const { constructWebhookEvent } = require("../utils/webhookUtils");
const { logWebhookEvent, logWebhookError } = require("../utils/logger");

const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    logWebhookEvent("endpoint.hit", { signature: sig });

    try {
      const event = constructWebhookEvent(req.body, sig, endpointSecret);
      logWebhookEvent("event.received", { type: event.type });

      if (event.type === "checkout.session.expired") {
        await handleExpiredSession(event.data.object);
      }

      res.json({ received: true });
    } catch (error) {
      logWebhookError(error);
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
