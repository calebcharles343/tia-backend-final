"use strict";

const { deleteOrderSevice } = require("./orderService");
const { logWebhookEvent } = require("../utils/logger");

async function handleExpiredSession(session) {
  const orderId = session.metadata.orderId;

  if (!orderId) {
    throw new Error("No orderId found in session metadata");
  }

  logWebhookEvent("session.expired", { orderId });
  await deleteOrderSevice(orderId);

  return { success: true, orderId };
}

module.exports = {
  handleExpiredSession,
};
