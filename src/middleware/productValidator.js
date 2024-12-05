import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("product_name").notEmpty().withMessage("Product name is required."),
  body("price").isDecimal().withMessage("Price must be a decimal value."),
  body("stock").isInt().withMessage("Stock must be an integer."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
