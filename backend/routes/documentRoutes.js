const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadSingleDocument } = require('../middleware/uploadMiddleware');
const { uploadDocument, reviewDocument } = require('../controllers/documentController');

const router = express.Router();

router.post('/upload', protect, uploadSingleDocument, uploadDocument);
router.put('/:id/review', protect, admin, reviewDocument);

module.exports = router;