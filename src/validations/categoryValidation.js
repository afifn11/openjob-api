const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow('', null),
});

module.exports = { createCategorySchema, updateCategorySchema };
