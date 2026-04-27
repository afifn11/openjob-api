const express = require('express');
const router = express.Router();
const {
  createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
} = require('../controllers/CategoryController');
const validate = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');

// Public
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected
router.post('/', authMiddleware, validate(createCategorySchema), createCategory);
router.put('/:id', authMiddleware, validate(updateCategorySchema), updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
