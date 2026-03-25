const express = require('express');
const router = express.Router();
const envController = require('../controllers/envController');
const authMiddleware = require('../middleware/auth');

// Mounted at /api/env
router.delete('/:id', authMiddleware, envController.deleteEnv);

module.exports = router;
