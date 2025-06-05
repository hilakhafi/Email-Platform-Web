const express = require('express')
const router = express.Router()

const mailsController = require('../controllers/mails')

// Get latest 50 emails for user
router.get('/', mailsController.get50Emails)
// Get email by ID
router.get('/:id', mailsController.getMail)
// Delete email by ID
router.delete('/:id', mailsController.deleteMail)
// Update email by ID
router.patch('/:id', mailsController.patchMail)
// Send a new email
router.post('/', mailsController.postMail)
// Search emails by query
router.get('/search/:query', mailsController.searchEmails)


module.exports = router
