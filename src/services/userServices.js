"use strict";

const User = require("../models/User.js"); // Import the Sequelize model

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

const getUserByIdService = async (id) => {
  const user = await User.findOne({
    where: { id },
  });

  user.password = undefined;

  return user;
};

// Update an existing user
const updateUserService = async (id, newUserData) => {
  const [rowsUpdated, [updatedUser]] = await User.update(newUserData, {
    where: { id },
    returning: true, // Return the updated rows
  });
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
  updateUserService,
  deleteUserService,
};
