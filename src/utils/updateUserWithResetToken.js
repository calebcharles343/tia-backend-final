const updateUserWithResetToken = async (user, hashedToken, resetExpires) => {
  await user.update({
    passwordResetToken: hashedToken,
    passwordResetExpires: resetExpires,
  });
};

module.exports = updateUserWithResetToken;
