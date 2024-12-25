"use strict";

const handleResponse = require("./handleResponse");

const signToken = require("../utils/signToken");

/*////////////////////////////////////// */
/*////////////////////////////////////// */

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
    secure: true,
  };

  user.password = undefined;
  res.cookie("jwt", token, cookieOptions);

  handleResponse(res, statusCode, "Authentication successful", {
    token,
    user,
  });
};

module.exports = createSendToken;
