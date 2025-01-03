const AppError = require("../utils/appError");

const userStatus = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.body.role)) {
      return next(
        new AppError("User role options are only Admin or User", 403)
      );
    }

    next();
  };
};

module.exports = userStatus;
