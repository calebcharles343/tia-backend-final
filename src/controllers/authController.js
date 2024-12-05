import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { sendMail } from "../utils/sendMail.js";
import { handleResponse } from "../utils/handleResponse.js";
import User from "../models/User.js"; // Import the Sequelize model
import { Op } from "sequelize";

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

  res.cookie("jwt", token, cookieOptions);

  handleResponse(res, statusCode, "Authentication successful", {
    token,
    user,
  });
};

// Check if the password has been changed after the JWT token was issued
export const changedPasswordAfterToken = (req, res, next) => {
  const { password_changed_at } = req.user;
  const JWTTimestamp = req.user.iat;

  if (password_changed_at) {
    const changedTimestamp = parseInt(
      new Date(password_changed_at).getTime() / 1000,
      10
    );
    if (JWTTimestamp < changedTimestamp) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  next();
};

// Signup new user
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirm_password, role } = req.body;

  if (password !== confirm_password) {
    return next(new AppError("Passwords do not match", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = role || "user";

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole,
  });

  createSendToken(newUser, 201, res);
});

// Login user
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

// Logout user
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });

  handleResponse(res, 200, "Logged out successfully");
};

// Protect route (authentication middleware)
export const protect = catchAsync(async (req, res, next) => {
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

// Restrict access to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

// Forgot password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await user.update({
    password_reset_token: hashedToken,
    password_reset_expires: resetExpires,
  });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendMail({
      userMail: user.email,
      message,
    });

    handleResponse(res, 200, "Token sent to email!");
  } catch (err) {
    await user.update({
      password_reset_token: null,
      password_reset_expires: null,
    });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

// Reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const currentTime = new Date(); // Get the current timestamp

  const user = await User.findOne({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires: { [Op.gt]: currentTime }, // Op.gt: greater than current time
    },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await user.update({
    password: hashedPassword,
    password_reset_token: null,
    password_reset_expires: null,
    password_changed_at: new Date(),
  });

  createSendToken(user, 200, res);
});

// Update password
export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  if (!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await user.update({
    password: hashedPassword,
    password_changed_at: new Date(),
  });

  createSendToken(user, 200, res);
});
