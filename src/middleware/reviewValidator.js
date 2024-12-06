"use strict";

const { body, validationResult } = require("express-validator");

const validateReview = [
  body("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),
  body("review").notEmpty().withMessage("Review cannot be empty."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateReview;
