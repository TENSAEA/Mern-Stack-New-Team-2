const Joi = require("joi");

const houseValidator = Joi.object({
  subCity: Joi.string().optional(),
  wereda: Joi.string().optional(),
  specialLocation: Joi.string().optional(),
  type: Joi.string()
    .valid(
      "one-room",
      "OneBedroom",
      "TwoBedroom",
      "ThreeBedroom",
      "Studio",
      "G+1",
      "G+2",
      "G+3"
    )
    .optional(),
  category: Joi.string()
    .valid(
      "Villa",
      "Apartment",
      "Condominium",
      "Service",
      "Penthouse",
      "others"
    )
    .optional(),
  price: Joi.number().optional(),
  comision: Joi.number().optional(),
  description: Joi.string().optional(),
  imageCover: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("available", "rented", "unavailable").optional(),
  approvalStatus: Joi.string()
    .valid("pending", "approved", "declined")
    .optional(),
  landlord: Joi.string().optional(),
  broker: Joi.string().optional(),
})
  .min(1)
  .options({ abortEarly: false });

const validateHouse = (req, res, next) => {
  const { error } = houseValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateHouse,
};
