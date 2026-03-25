const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, credentialController.getCredentials);
router.post('/', authMiddleware, credentialController.createCredential);
router.delete('/:id', authMiddleware, credentialController.deleteCredential);

module.exports = router;
