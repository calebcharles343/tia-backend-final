// Check if the password has been changed after the JWT token was issued
const changedPasswordAfterToken = (req, res, next) => {
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

module.exports = changedPasswordAfterToken;
