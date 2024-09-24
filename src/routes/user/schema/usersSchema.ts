import Joi from "joi";
import joi, { object } from "joi";

export const userCreateSchema = joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    ),
  passwordConfirm: joi.string().valid(joi.ref("password")).required(),
});

export const updateUserSchema = joi.object({
  firstName: joi.string().optional(),
  lastName: joi.string().optional().min(1),
  email: joi.string().email().optional().empty(""),
  password: joi
    .string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    ),
});
