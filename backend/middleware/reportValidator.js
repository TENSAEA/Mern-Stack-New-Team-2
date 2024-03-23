const { body, validationResult } = require("express-validator");

exports.validateReport = [
  body("type").not().isEmpty().withMessage("Report type is required"),
  body("content").not().isEmpty().withMessage("Report content is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
