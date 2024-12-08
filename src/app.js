"use strict";

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
const multer = require("multer");
const { memoryStorage } = multer;

dotenv.config();

const app = express();

////////////////////////////////////////////////////////////
// Middlewares
////////////////////////////////////////////////////////////
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(
  "/shopping-list/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Storage setup for multer
const storage = memoryStorage();
const upload = multer({ storage });

// Routes
app.use("/api/v1/e-commerce/users", userRouter);
app.use("/api/v1/e-commerce/products", productRouter);
app.use("/api/v1/e-commerce/orders", orderRouter);
app.use("/api/v1/e-commerce/reviews", reviewRouter);
app.use("/api/v1/e-commerce/images", a3BucketRouter);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
