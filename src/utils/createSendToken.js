"use strict";

const handleResponse = require("./handleResponse");
const signToken = require("../utils/signToken");

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  // Use the environment to determine if cookies should be secure
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction && req.secure;

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure, // Set to true only in production over HTTPS
    sameSite: isProduction ? "strict" : "lax", // Use lax for dev, strict for prod
  };

  // Remove sensitive information from user object
  user.password = undefined;

  // Set the cookie
  res.cookie("jwt", token, cookieOptions);

  // Send response with token and user info
  handleResponse(res, statusCode, "Authentication successful", {
    token,
    user,
  });
};

module.exports = createSendToken;

module.exports = createSendToken;
