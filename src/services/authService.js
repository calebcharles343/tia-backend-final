"use strict";

const User = require("../models/User.js");
const AppError = require("../utils/appError.js");
const crypto = require("crypto");

const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendMail.js");
const generateResetToken = require("../utils/generateResetToken.js");
const updateUserWithResetToken = require("../utils/updateUserWithResetToken.js");
const { Op } = require("sequelize");
const comparePasswords = require("../utils/comparePasswords.js");
const { getUserPresignedUrls } = require("../models/A3Bucket.js");

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

  const avatarId = `userAvatar-${id}`;
  const { presignedUrls, err } = await getUserPresignedUrls(avatarId);

  if (err) {
    user.avatar = undefined;
  } else {
    user.avatar = presignedUrls[0]?.url || undefined;
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

module.exports = {
  signupService,
  loginService,
  forgotPasswordService,
  findUserByResetTokenService,
  updateUserPasswordService,
};

// const user = await forgotPasswordService(req.body.email);
