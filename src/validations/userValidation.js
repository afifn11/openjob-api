const Joi = require('joi');

const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'company', 'admin').default('user'),
  phone: Joi.string().max(20).allow('', null),
  address: Joi.string().allow('', null),
  bio: Joi.string().allow('', null),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().max(20).allow('', null),
  address: Joi.string().allow('', null),
  bio: Joi.string().allow('', null),
});

module.exports = { registerUserSchema, updateUserSchema };
