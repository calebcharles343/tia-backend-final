const AppError = require("../utils/appError");

const userStatus = (...status) => {
  return (req, res, next) => {
    if (!status.includes(req.body.role)) {
      return next(
        new AppError("User role options are only Admin or User", 403)
      );
    }

    next();
  };
};

module.exports = userStatus;
