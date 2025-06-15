const express = require('express');
const router = express.Router();
const { sendMail, downloadAttachment } = require('../controllers/files');
const { upload } = require('../utils/upload');

// שליחת מייל עם קבצים מצורפים
router.post('/send', upload.array('attachments', 10), sendMail);

// הורדת קובץ מצורף
router.get('/attachments/:filename', downloadAttachment);

module.exports = router;
