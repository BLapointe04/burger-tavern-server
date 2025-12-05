import Joi from "joi";

export const itemSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  desc: Joi.string().min(5).max(500).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string()
    .valid("burgers", "sides", "specials")
    .required(),
  image: Joi.string().uri().allow("", null),
  slug: Joi.string().min(1).required(),
});
