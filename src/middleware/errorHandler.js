"use strict";

const AppError = require("../utils/appError");

const handleJWTError = () =>
  new AppError("Invalid or expired token! Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const handleDuplicateKey = () => new AppError("Already exists.", 401);
const handleSequelizeDatabaseError = () => new AppError("Does not exist.", 500);

const errorHandler = (err, req, res, next) => {
  const env = process.env.NODE_ENV
    ? process.env.NODE_ENV.trim()
    : "development";
  const isDevelopment = env === "development";
  const isProduction = env === "production";

  // If error is not an instance of AppError, create a new AppError with generic message
  if (!(err instanceof AppError)) {
    err = new AppError(err, 500);
  }

  // Set default properties if not already set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (isDevelopment) {
    // Detailed error response in development
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (isProduction) {
    let error = { ...err, message: err.message };

    if (
      error.message === "jwt malformed" ||
      error.message.includes("jwt malformed")
    )
      error = handleJWTError();
    if (
      error.message === "jwt expired" ||
      error.message.includes("jwt expired")
    )
      error = handleJWTExpiredError();
    if (
      error.message === "Validation error" ||
      error.message.includes("SequelizeUniqueConstraintError")
    )
      error = handleDuplicateKey();
    if (
      error.message === "does not exist" ||
      error.message.includes("does not exist")
    )
      error = handleSequelizeDatabaseError();

    // Send operational error message; generic message for non-operational errors
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.isOperational ? error.message : "Something went wrong!",
    });
  }

  next();
};

module.exports = errorHandler;
