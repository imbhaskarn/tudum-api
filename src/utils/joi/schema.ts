import Joi from 'joi';

export const registrationSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,16}$/)
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,16}$/)
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
    })
});
