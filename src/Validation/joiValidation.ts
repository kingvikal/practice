import Joi from "joi";

export const RegisterValidate = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number(),
  city: Joi.string().required(),
  contact: Joi.string(),
  photo: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  userType: Joi.required(),
});
