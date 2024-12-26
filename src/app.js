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
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5176",
  "https://tia-backend-final.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and authentication headers
  })
);

app.set("trust proxy", true);

app.use(cookieParser());

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

// Swagger Documentation
app.use(
  "/e-commerce/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Multer Storage
const storage = memoryStorage();
const upload = multer({ storage });

// Routes
app.use("/api/v1/e-commerce/users", userRouter);
app.use("/api/v1/e-commerce/products", productRouter);
app.use("/api/v1/e-commerce/orders", orderRouter);
app.use("/api/v1/e-commerce/reviews", reviewRouter);
app.use("/api/v1/e-commerce/images", a3BucketRouter);

// Error Handling
app.use(errorHandler);

module.exports = app;
