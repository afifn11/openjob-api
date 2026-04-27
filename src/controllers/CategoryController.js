const CategoryService = require('../services/CategoryService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.createCategory(req.body);
  return sendSuccess(res, category, 201, 'Category created successfully');
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryService.getAllCategories();
  return sendSuccess(res, { categories });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryById(req.params.id);
  return sendSuccess(res, category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.updateCategory(req.params.id, req.body);
  return sendSuccess(res, category, 200, 'Category updated successfully');
});

const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryService.deleteCategory(req.params.id);
  return sendSuccess(res, {}, 200, 'Category deleted successfully');
});

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
