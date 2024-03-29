const Joi = require("joi");

const houseValidator = Joi.object({
  city: Joi.string().required().messages({
    "any.required": "City is required",
  }),
  subCity: Joi.string().required().messages({
    "any.required": "Sub-city is required",
  }),
  wereda: Joi.string().required().messages({
    "any.required": "Wereda is required",
  }),
  specialLocation: Joi.string().required().messages({
    "any.required": "Special location is required",
  }),
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
    .required()
    .messages({
      "any.required": "House type is required",
      "any.only": "Invalid house type",
    }),
  category: Joi.string()
    .valid(
      "Villa",
      "Apartment",
      "Condominium",
      "Service",
      "Penthouse",
      "others"
    )
    .required()
    .messages({
      "any.required": "Category is required",
      "any.only": "Invalid category",
    }),
  price: Joi.number().required().messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
  }),
  comision: Joi.number().default(0),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
  }),
  // imageCover: Joi.string().required().messages({
  //   "any.required": "Cover image is required",
  //   "string.empty": "Cover image cannot be empty",
  // }),
  images: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid("available", "rented", "unavailable")
    .default("available"),
  approvalStatus: Joi.string()
    .valid("pending", "approved", "declined")
    .default("pending"),
  landlord: Joi.string().required().optional(),
  broker: Joi.string().optional(),
}).options({ abortEarly: false });

const validateHouse = (req, res, next) => {
  const { error } = houseValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
module.exports = validateHouse;
