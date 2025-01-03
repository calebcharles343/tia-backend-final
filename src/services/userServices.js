"use strict";

const { getUserPresignedUrls } = require("../models/A3Bucket.js");

const { User, Order, OrderItem, Product } = require("../models/index.js");

const getUserByIdService = async (id) => {
  try {
    const user = await User.findOne({
      where: { id },
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

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const avatarId = `userAvatar-${id}`;
    const { presignedUrls, err } = await getUserPresignedUrls(avatarId);

    if (err) {
      user.avatar = undefined;
    } else {
      user.avatar = presignedUrls[0]?.url || undefined;
    }

    // user.password = undefined; // Optionally remove or hash password before returning

    return user;
  } catch (error) {
    console.error(`Error fetching user by ID ${id}:`, error);
    throw error;
  }
};

// Fetch all active users
const getAllUsersService = async () => {
  const users = await User.findAll();

  const userPromises = users.map(async (user) => {
    const updateduser = await getUserByIdService(user.id);
    return updateduser;
  });

  // Wait for all users to be processed
  const updatedUsers = await Promise.all(userPromises);

  return updatedUsers;
};

// // Fetch all inactive users
// const getAllInactiveUsersService = async () => {
//   const users = await User.findAll({
//     where: { active: false },
//   });

//   const userPromises = users.map(async (user) => {
//     const updateduser = await getUserByIdService(user.id);
//     return updateduser;
//   });

//   // Wait for all users to be processed
//   const updatedUsers = await Promise.all(userPromises);

//   return updatedUsers;
// };

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
  // getAllInactiveUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};
