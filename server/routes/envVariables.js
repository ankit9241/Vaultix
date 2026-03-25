const express = require('express');
const router = express.Router({ mergeParams: true });
const envController = require('../controllers/envController');
const authMiddleware = require('../middleware/auth');

// Mounted at /api/sections/:sectionId/env
router.post('/', authMiddleware, envController.createEnv);
router.get('/', authMiddleware, envController.getEnvs);

module.exports = router;
