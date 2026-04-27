const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const categoryRoutes = require('./categoryRoutes');
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const documentRoutes = require('./documentRoutes');
const profileRoutes = require('./profileRoutes');

router.use('/users', userRoutes);
router.use('/authentications', authRoutes);
router.use('/companies', companyRoutes);
router.use('/categories', categoryRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/documents', documentRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
