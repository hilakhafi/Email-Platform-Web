const express = require('express');
const router = express.Router();
const { upload, sendMail, downloadAttachment } = require('../controllers/files');
const authenticateToken = require('../middleware/auth');

// שליחת מייל עם קבצים מצורפים
router.post('/send', authenticateToken, upload.array('attachments', 10), sendMail);

// הורדת קובץ מצורף
router.get('/attachments/:filename', authenticateToken, downloadAttachment);

module.exports = router;