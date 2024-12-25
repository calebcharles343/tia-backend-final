"use strict";
const signToken = require("../utils/signToken");
const handleResponse = require("./handleResponse");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  // console.log("Token:", token);
  // console.log("Cookie Options:", cookieOptions);

  handleResponse(res, statusCode, "Authentication successful", {
    token,
    user,
  });
};

module.exports = createSendToken;
