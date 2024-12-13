const bcrypt = require("bcrypt");
const AppError = require("./appError");

const comparePasswords = async (currentPassword, userPassword) => {
  if (!currentPassword || !userPassword) {
    throw new AppError(
      "Both current password and user password are required.",
      400
    );
  }

  const isMatch = await bcrypt.compare(currentPassword, userPassword);
  if (!isMatch) {
    throw new AppError("Your current password is wrong.", 401);
  }

  return isMatch;
};

module.exports = comparePasswords;
