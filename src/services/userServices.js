import User from "../models/User.js"; // Import the Sequelize model

// Fetch all active users
export const getAllUsersService = async () => {
  const users = await User.findAll({
    where: { active: true },
  });
  return users;
};

// Fetch all inactive users
export const getAllInactiveUsersService = async () => {
  const users = await User.findAll({
    where: { active: false },
  });
  return users;
};

// Fetch a user by ID
export const getUserByIdService = async (id) => {
  const user = await User.findOne({
    where: { id },
  });
  return user;
};

// Create a new user
export const createUserService = async (name, email) => {
  const newUser = await User.create({
    name,
    email,
  });
  return newUser;
};

// Update an existing user
export const updateUserService = async (id, name, email) => {
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
export const deleteUserService = async (id) => {
  const [rowsUpdated, [updatedUser]] = await User.update(
    { active: false },
    {
      where: { id },
      returning: true,
    }
  );
  return updatedUser;
};
