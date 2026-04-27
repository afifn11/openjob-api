const express = require('express');
const router = express.Router();
const {
  createApplication, getAllApplications, getApplicationById,
  getApplicationsByUser, getApplicationsByJob, updateApplication, deleteApplication,
} = require('../controllers/ApplicationController');
const validate = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createApplicationSchema, updateApplicationSchema } = require('../validations/applicationValidation');

// All application routes require auth
router.use(authMiddleware);

// IMPORTANT: specific routes before /:id to avoid route conflicts
router.get('/user/:userId', getApplicationsByUser);
router.get('/job/:jobId', getApplicationsByJob);

router.post('/', validate(createApplicationSchema), createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.put('/:id', validate(updateApplicationSchema), updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
