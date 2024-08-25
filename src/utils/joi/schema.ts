import Joi from 'joi';

export const registrationSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(/^.{8,16}$/))
    .required()
    .messages({
      'string.pattern.base': 'Password must be at 8 to 16 characters long.'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(/^.{8,16}$/))
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at 8 to 16 characters long.'
    })
});
