"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const userByToken = require("../utils/userByToken.js");
const {
  deleteUserService,
  getAllInactiveUsersService,
  getAllUsersService,
  updateUserService,
} = require("../services/userServices.js");
const filterObj = require("../utils/filterObj.js");

const handleResponse = require("../utils/handleResponse.js");
const AppError = require("../utils/appError.js");

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await getAllUsersService();
  handleResponse(res, 200, "Users fetched successfully", users);
});

const getAllInactiveUsers = catchAsync(async (req, res, next) => {
  const inactiveUsers = await getAllInactiveUsersService();
  handleResponse(
    res,
    200,
    "Closed accounts fetched successfully",
    inactiveUsers
  );
});

const getUserById = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);

  if (!currentUser) return handleResponse(res, 404, "User not found");
  handleResponse(res, 200, "User fetched successfully", currentUser);
});

const updateMe = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");
  const { password, passwordConfirm } = req.body;

  // 1) Create error if user POSTs password data
  if (password || passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user record
  const updatedUser = await updateUserService(currentUser.id, {
    name: filteredBody.name,
    email: filteredBody.email,
  });

  if (!updatedUser) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);
  if (!currentUser) return handleResponse(res, 404, "User not found");

  const deletedUser = await deleteUserService(currentUser.id);

  if (!deletedUser) return handleResponse(res, 404, "User not found");
  handleResponse(res, 200, "User deleted successfully", deletedUser);
});

module.exports = {
  getAllUsers,
  getAllInactiveUsers,
  getUserById,
  updateMe,
  deleteUser,
};
