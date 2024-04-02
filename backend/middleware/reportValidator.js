const Joi = require("joi");

exports.validateReport = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().required().error(new Error("Report type is required")),
    content: Joi.string()
      .required()
      .error(new Error("Report content is required")),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  } else {
    next();
  }
};
