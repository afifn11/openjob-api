const Joi = require('joi');

const createCompanySchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  description: Joi.string().required(),   // WAJIB - tanpa ini → 400
  industry: Joi.string().max(100).allow('', null),
  website: Joi.string().uri().max(255).allow('', null),
  logo: Joi.string().allow('', null),
  location: Joi.string().max(200).allow('', null),
  size: Joi.string().max(50).allow('', null),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null),
});

const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(150),
  description: Joi.string().allow('', null),
  industry: Joi.string().max(100).allow('', null),
  website: Joi.string().uri().max(255).allow('', null),
  logo: Joi.string().allow('', null),
  location: Joi.string().max(200).allow('', null),
  size: Joi.string().max(50).allow('', null),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null),
});

module.exports = { createCompanySchema, updateCompanySchema };
