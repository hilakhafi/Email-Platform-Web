const express = require('express');
const router = express.Router();

const blacklistController = require('../controllers/blacklist');

// Add a URL to blacklist
router.post('/', blacklistController.addToBlackList);
// Remove a URL from blacklist by ID
router.delete('/:id', blacklistController.removeFromBlackList); 

module.exports = router;
