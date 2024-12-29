// Update the webhook route configuration in app.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler.js");
const userRouter = require("./routes/userRoutes.js");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const productRouter = require("./routes/productRoutes.js");
const orderRouter = require("./routes/orderRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const a3BucketRouter = require("./routes/a3BucketRoutes.js");
const webhookRouter = require("./routes/webhookRouter.js");

dotenv.config();

const app = express();

// Webhook route must be first, before any body parsers
app.use("/api/v1/e-commerce/webhook", webhookRouter);

// Regular routes with JSON parsing
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 2 * 60 * 1000,
  message: "Too many requests from this IP, please try again in two mins!",
});
app.use("/api", limiter);

// Routes
app.use(
  "/e-commerce/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use("/api/v1/e-commerce/users", userRouter);
app.use("/api/v1/e-commerce/products", productRouter);
app.use("/api/v1/e-commerce/orders", orderRouter);
app.use("/api/v1/e-commerce/reviews", reviewRouter);
app.use("/api/v1/e-commerce/images", a3BucketRouter);

// Error Handling
app.use(errorHandler);

module.exports = app;
