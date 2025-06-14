const express = require('express');
const router = express.Router();

const blacklistController = require('../controllers/blacklist');

// Add a URL to blacklist
router.post('/', blacklistController.addToBlackList);
// Remove a URL from blacklist by ID
router.delete('/:id', blacklistController.removeFromBlackList);
// Check if an email is spam based on subject and body 
//router.post('/url', blacklistController.checkEmailForSpam);
// Mark an email as spam
//router.post('/mark-spam', blacklistController.markMailAsSpam);


module.exports = router;
