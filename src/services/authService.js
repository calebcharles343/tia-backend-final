"use strict";

const { User, Order, OrderItem, Product } = require("../models/index.js");
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
  // Create the new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role,
  });

  // Fetch the user again with associated data
  const userWithAssociations = await User.findOne({
    where: { email },
    include: {
      model: Order,
      as: "Orders", // Include associated orders
      include: [
        {
          model: OrderItem,
          as: "Items", // Match alias defined in model
          include: [
            {
              model: Product,
              as: "Product", // Match alias defined in model
            },
          ],
        },
      ],
    },
  });

  userWithAssociations.password = undefined;

  return userWithAssociations;
};

const loginService = async (email, password, next) => {
  const user = await User.findOne({
    where: { email },
    include: {
      model: Order,
      as: "Orders",
      include: [
        {
          model: OrderItem,
          as: "Items",
          include: [
            {
              model: Product,
              as: "Product",
            },
          ],
        },
      ],
    },
  });

  if (!user || !(await comparePasswords(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.active === false) {
    return next(new AppError("This account is no longer active", 401));
  }

  const avatarId = `userAvatar-${user.id}`;
  const { presignedUrls, err } = await getUserPresignedUrls(avatarId);

  if (err) {
    user.avatar = undefined;
  } else {
    user.avatar = presignedUrls[0]?.url || undefined;
  }
  user.password = undefined;
  user.passwordResetToken = undefined;

  return user;
};

const sendResetEmail = async (user, resetToken, req) => {
  const resetURL = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;

  await sendMail({
    userMail: user.email,
    resetURL,
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
    active: true,
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
