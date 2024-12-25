"use strict";
const signToken = require("../utils/signToken");
const handleResponse = require("./handleResponse");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;

  // console.log("Token:", token);
  // console.log("Cookie Options:", cookieOptions);

  handleResponse(res, statusCode, "Authentication successful", {
    token,
    user,
  });
};

module.exports = createSendToken;
