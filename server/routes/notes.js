const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, noteController.getNotes);
router.post('/', authMiddleware, noteController.createNote);
router.delete('/:id', authMiddleware, noteController.deleteNote);

module.exports = router;
