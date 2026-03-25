const express = require('express');
const router = express.Router({ mergeParams: true });
const sectionController = require('../controllers/sectionController');
const authMiddleware = require('../middleware/auth');

// Note: These will be mounted at /api/projects/:projectId/sections
router.post('/', authMiddleware, sectionController.createSection);
router.get('/', authMiddleware, sectionController.getSections);

module.exports = router;
