const express = require('express');
const router = express.Router();
const {
  createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany,
} = require('../controllers/CompanyController');
const validate = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createCompanySchema, updateCompanySchema } = require('../validations/companyValidation');

// Public
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

// Protected
router.post('/', authMiddleware, validate(createCompanySchema), createCompany);
router.put('/:id', authMiddleware, validate(updateCompanySchema), updateCompany);
router.delete('/:id', authMiddleware, deleteCompany);

module.exports = router;
