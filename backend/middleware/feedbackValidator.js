const Joi = require("joi");

const feedbackValidator = Joi.object({
  //   house: Joi.string().required().messages({
  //     "any.required": "House ID is required",
  //   }),
  //   tenet: Joi.string().required().messages({
  //     "any.required": "Tenet ID is required",
  //   }),
  rating: Joi.number().min(1).max(5).required().messages({
    "any.required": "Rating is required",
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
  }),
  comment: Joi.string().required().messages({
    "any.required": "Comment is required",
    "string.empty": "Comment cannot be empty",
  }),
}).options({ abortEarly: false });

const validateFeedback = (req, res, next) => {
  const { error } = feedbackValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateFeedback;
