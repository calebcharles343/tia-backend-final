"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { logWebhookError } = require("./logger");

function constructWebhookEvent(payload, signature, secret) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    logWebhookError(err, { signature });
    throw err;
  }
}

module.exports = {
  constructWebhookEvent,
};
