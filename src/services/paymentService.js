"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (items, orderId, successUrl, cancelUrl) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price), // Convert to cents and round
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId, // Store orderId in metadata
      },
    });

    return session;
  } catch (error) {
    throw new Error(`Checkout session creation failed: ${error.message}`);
  }
};
// const cancelOrder = async (req, res, next) => {
//   try {
//     const { session_id } = req.query;
//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     if (session && session.metadata && session.metadata.orderId) {
//       const orderId = session.metadata.orderId;
//       await deleteOrderService(orderId);
//       res
//         .status(200)
//         .json({ status: "success", message: "Order cancelled successfully" });
//     } else {
//       res
//         .status(400)
//         .json({ status: "fail", message: "Invalid session or order ID" });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { createCheckoutSession };
