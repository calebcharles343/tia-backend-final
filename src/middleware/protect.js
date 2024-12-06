"use strict";

const catchAsync = require("./catchAsync");
const { AppError } = require("../utils/appError.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Protect route (authentication middleware)
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findByPk(decoded.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  req.user = user;
  req.user.iat = decoded.iat;

  next();
});

module.exports = protect;
