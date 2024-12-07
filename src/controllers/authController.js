"use strict";
const bcrypt = require("bcrypt");

const AppError = require("../utils/appError.js");
const handleResponse = require("../utils/handleResponse.js");
const catchAsync = require("../middleware/catchAsync.js");
const createSendToken = require("../utils/createSendToken.js");
const {
  signupService,
  loginService,
  forgotPasswordService,
  findUserByResetTokenService,
  updateUserPasswordService,
  getUserByIdService,
} = require("../services/AuthService.js");
const comparePasswords = require("../utils/comparePasswords.JS");

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirm_password, role } = req.body;
  // passwords check
  if (password !== confirm_password) {
    return next(new AppError("Passwords do not match", 400));
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create a new user
  const newUser = await signupService(name, email, hashedPassword, role);
  // generate token and send response
  createSendToken(newUser, 201, res);
});

// login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await loginService(email, password, next);
  createSendToken(user, 200, res);
});

// Logout user
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  handleResponse(res, 200, "Logged out successfully");
};

// Forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  await forgotPasswordService(req.body.email, req);
  res.status(200).json({ status: "success", message: "Token sent to email!" });
});

// Reset password
const resetPassword = catchAsync(async (req, res, next) => {
  const user = await findUserByResetTokenService(req.params.token);
  await updateUserPasswordService(user, req.body.password);
  createSendToken(user, 200, res);
});

// Update password
const updatePassword = catchAsync(async (req, res, next) => {
  const user = await getUserByIdService(req.user.id);
  await comparePasswords(req.body.passwordCurrent, user.password);
  await updateUserPasswordService(user, req.body.password);
  createSendToken(user, 200, res);
});

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
