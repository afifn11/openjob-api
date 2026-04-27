const express = require('express');
const router = express.Router();
const { getAllBookmarks } = require('../controllers/BookmarkController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /bookmarks — get all bookmarks for logged-in user
router.get('/', authMiddleware, getAllBookmarks);

module.exports = router;
