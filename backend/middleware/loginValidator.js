const Joi = require("joi");

const loginValidator = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "email is required",
    "string.empty": "email cannot be empty",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
}).options({ abortEarly: false });

const validateLogin = (req, res, next) => {
  const { error } = loginValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
module.exports = validateLogin;
