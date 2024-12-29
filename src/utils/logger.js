"use strict";

function logWebhookEvent(eventType, data) {
  console.log("🎯 Webhook received:", {
    type: eventType,
    timestamp: new Date().toISOString(),
    data,
  });
}

function logWebhookError(error, context = {}) {
  console.error("❌ Webhook error:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

module.exports = {
  logWebhookEvent,
  logWebhookError,
};
