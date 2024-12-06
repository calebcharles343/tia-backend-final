import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/userRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/OrderRoute.js";
import reviewRouter from "./routes/reviewRoutes.js";

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

// Routes
app.use("/api/v1/e-commerce/users", userRouter);
app.use("/api/v1/e-commerce/products", productRouter);
app.use("/api/v1/e-commerce/orders", orderRouter);
app.use("/api/v1/e-commerce/orders", reviewRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
