const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getAllDocuments,
  serveDocument,
  deleteDocument,
} = require('../controllers/DocumentController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public
router.get('/', getAllDocuments);
// GET /documents/:id → serve PDF file (application/pdf)
router.get('/:id', serveDocument);

// Protected
router.post('/', authMiddleware, upload.single('document'), uploadDocument);
router.delete('/:id', authMiddleware, deleteDocument);

module.exports = router;
