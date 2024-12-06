"use strict";

const catchAsync = require("../middleware/catchAsync.js");
const {
  deleteUserService,
  getAllInactiveUsersService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} = require("../services/userServices.js");

const handleResponse = require("../utils/handleResponse.js");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
  const id = req.params.id;
  const user = await getUserByIdService(id);

  if (!user) return handleResponse(res, 404, "User not found");
  handleResponse(res, 200, "User fetched successfully", user);
});

const updateMe = catchAsync(async (req, res, next) => {
  console.log("Received update request");

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  console.log("Filtered body:", filteredBody);

  // 3) Update user record
  const updatedUser = await updateUserService(
    req.user.id,
    filteredBody.name,
    filteredBody.email
  );

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
  const id = req.params.id;

  const deletedUser = await deleteUserService(id);

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
