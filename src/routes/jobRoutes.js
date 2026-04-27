const express = require('express');
const router = express.Router();
const {
  createJob, getAllJobs, getJobById, getJobsByCompany, getJobsByCategory,
  updateJob, deleteJob,
} = require('../controllers/JobController');
const {
  createBookmark, getBookmarkById, deleteBookmark,
} = require('../controllers/BookmarkController');
const validate = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createJobSchema, updateJobSchema } = require('../validations/jobValidation');

// Public - specific routes MUST come before /:id
router.get('/company/:companyId', getJobsByCompany);
router.get('/category/:categoryId', getJobsByCategory);
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected
router.post('/', authMiddleware, validate(createJobSchema), createJob);
router.put('/:id', authMiddleware, validate(updateJobSchema), updateJob);
router.delete('/:id', authMiddleware, deleteJob);

// Bookmark sub-routes (protected)
router.post('/:jobId/bookmark', authMiddleware, createBookmark);
router.get('/:jobId/bookmark/:id', authMiddleware, getBookmarkById);
router.delete('/:jobId/bookmark', authMiddleware, deleteBookmark);

module.exports = router;
