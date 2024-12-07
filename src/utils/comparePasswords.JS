const bcrypt = require("bcrypt");
const AppError = require("../utils/appError.js");

const comparePasswords = async (currentPassword, userPassword) => {
  const isMatch = await bcrypt.compare(currentPassword, userPassword);
  if (!isMatch) {
    throw new AppError("Your current password is wrong.", 401);
  }

  return isMatch;
};

module.exports = comparePasswords;
