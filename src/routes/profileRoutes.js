const express = require('express');
const router = express.Router();
const { getProfile, getMyApplications, getMyBookmarks } = require('../controllers/ProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

// All profile routes require auth
router.use(authMiddleware);

router.get('/', getProfile);
router.get('/applications', getMyApplications);
router.get('/bookmarks', getMyBookmarks);

module.exports = router;
