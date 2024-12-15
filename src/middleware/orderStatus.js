const AppError = require("../utils/appError");

const orderStatus = (...status) => {
  return (req, res, next) => {
    if (!status.includes(req.body.status)) {
      return next(
        new AppError(
          "Order status options only pending, completed or cancelled",
          403
        )
      );
    }

    next();
  };
};

module.exports = orderStatus;
