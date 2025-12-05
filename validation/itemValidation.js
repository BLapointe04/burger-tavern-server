import Joi from "joi";

const itemSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().precision(2).required(),
  description: Joi.string().allow(""),
  imageUrl: Joi.string().uri().required(),
  category: Joi.string().required()
});

export default itemSchema;
