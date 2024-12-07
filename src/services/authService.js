"use strict";

const User = require("../models/User.js");
const AppError = require("../utils/appError.js");
const crypto = require("crypto");

const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendMail.js");
const generateResetToken = require("../utils/generateResetToken.js");
const updateUserWithResetToken = require("../utils/updateUserWithResetToken.js");
const { Op } = require("sequelize");
const comparePasswords = require("../utils/comparePasswords.JS");
// Fetch all active users
const getAllUsersService = async () => {
  const users = await User.findAll({
    where: { active: true },
  });
  return users;
};

// Fetch all inactive users
const getAllInactiveUsersService = async () => {
  const users = await User.findAll({
    where: { active: false },
  });
  return users;
};

// Fetch a user by ID
const getUserByIdService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const signupService = async (name, email, hashedPassword, role = "User") => {
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role,
  });
  return newUser;
};

const loginService = async (email, password, next) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user || !(await comparePasswords(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  return user;
};

const sendResetEmail = async (user, resetToken, req) => {
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  await sendMail({
    userMail: user.email,
    message,
  });
};

const forgotPasswordService = async (email, req) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new AppError(
      `There is no user registered with the email: ${email}`,
      404
    );
  }

  const { resetToken, hashedToken, resetExpires } = generateResetToken();
  await updateUserWithResetToken(user, hashedToken, resetExpires);

  try {
    await sendResetEmail(user, resetToken, req);
  } catch (err) {
    await updateUserWithResetToken(user, null, null);
    throw new AppError(
      "There was an error sending the email. Please try again later.",
      500
    );
  }
};

const findUserByResetTokenService = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const currentTime = new Date().toISOString();
  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: currentTime },
    },
  });
  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }
  return user;
};

const updateUserPasswordService = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordChangedAt: new Date(),
  });
};

// Update an existing user
const updateUserService = async (id, name, email) => {
  const [rowsUpdated, [updatedUser]] = await User.update(
    { name, email },
    {
      where: { id },
      returning: true, // Return the updated rows
    }
  );
  return updatedUser; // Return the first updated user
};

// Soft delete a user (mark as inactive)
const deleteUserService = async (id) => {
  const [rowsUpdated, [updatedUser]] = await User.update(
    { active: false },
    {
      where: { id },
      returning: true,
    }
  );
  return updatedUser;
};

module.exports = {
  getAllUsersService,
  getAllInactiveUsersService,
  getUserByIdService,
  signupService,
  loginService,
  forgotPasswordService,
  findUserByResetTokenService,
  updateUserPasswordService,
  updateUserService,
  deleteUserService,
};

// const user = await forgotPasswordService(req.body.email);
