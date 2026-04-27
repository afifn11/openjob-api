const Joi = require('joi');

const createJobSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().required(),
  requirements: Joi.string().allow('', null),
  // field name kita sendiri
  type: Joi.string().max(50).allow('', null),
  location: Joi.string().max(200).allow('', null),
  salary_min: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(0).allow(null),
  is_active: Joi.boolean().default(true),
  // field dari Postman Dicoding - diterima tapi diabaikan
  job_type: Joi.string().allow('', null),
  experience_level: Joi.string().allow('', null),
  location_type: Joi.string().allow('', null),
  location_city: Joi.string().allow('', null),
  is_salary_visible: Joi.boolean().allow(null),
  status: Joi.string().allow('', null),
});

const updateJobSchema = Joi.object({
  company_id: Joi.string(),
  category_id: Joi.string(),
  title: Joi.string().min(3).max(200),
  description: Joi.string(),
  requirements: Joi.string().allow('', null),
  type: Joi.string().max(50).allow('', null),
  location: Joi.string().max(200).allow('', null),
  salary_min: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(0).allow(null),
  is_active: Joi.boolean(),
  // field dari Postman Dicoding
  job_type: Joi.string().allow('', null),
  experience_level: Joi.string().allow('', null),
  location_type: Joi.string().allow('', null),
  location_city: Joi.string().allow('', null),
  is_salary_visible: Joi.boolean().allow(null),
  status: Joi.string().allow('', null),
});

module.exports = { createJobSchema, updateJobSchema };
