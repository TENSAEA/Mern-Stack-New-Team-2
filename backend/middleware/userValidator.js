const Joi = require("joi");

const passwordComplexityOptions = {
  min: 8,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

const userValidator = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
  role: Joi.string()
    .valid("tenant", "landlord", "broker", "admin", "superadmin")
    .required()
    .messages({
      "any.required": "Role is required",
      "any.only": "Invalid role",
    }),
  isBlocked: Joi.boolean().default(false),
  isDeactivated: Joi.boolean().default(false),
  image: Joi.string().allow("").optional(),
}).options({ abortEarly: false });

const validateUser = (req, res, next) => {
  const { error } = userValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
module.exports = validateUser;
