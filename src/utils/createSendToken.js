"use strict";
const jwt = require("jsonwebtoken");
const handleResponse = require("./handleResponse");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send the JWT token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true;

  user.password = undefined;

  res.cookie("jwt", token, Options);

  handleResponse(res, statusCode, "Authentication successful", {
    token,
    user,
  });
};

module.exports = createSendToken;
