const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const authMiddleware = require('../middleware/auth');

// Plain section routes
router.get('/:id', authMiddleware, sectionController.getSectionById);
router.delete('/:id', authMiddleware, sectionController.deleteSection);

module.exports = router;
