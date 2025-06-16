const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// הגדרת multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'files');
    // יצירת התיקייה אם היא לא קיימת
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const sendMail = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received files:', req.files);
    
    // קבלת הנתונים - שים לב לשמות הנכונים
    const { sendTo, subject, body } = req.body; // שימוש ב-sendTo במקום to
    const attachments = req.files || [];

    // אימות token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, 'secretkeyHHE');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const userId = decoded.userId;

    // וידוא שיש את כל הנתונים הנדרשים
    if (!sendTo || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: sendTo, subject, or body' 
      });
    }

    // בדיקת פורמט אימייל (כמו במails.js הקיים)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sendTo)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const mailData = {
      ownerId: userId,
      from: userId,
      to: parseInt(sendTo),
      subject,
      body,
      timestamp: new Date().toISOString(),
      spam: false,
      preview: body.substring(0, 50) + '...',
      isRead: false,
      category: 'sent',
      attachments: attachments.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      }))
    };

    const inboxMail = {
      ...mailData,
      category: 'inbox',
      ownerId: parseInt(sendTo)
    };

    // שמירת המיילים בקבצי JSON (כמו בmails.js הקיים)
    const Emails = require('../models/mails');
    const Users = require('../models/users');

    // בדיקה שהמשתמש קיים
    const recipient = Users.getUserByMail(sendTo);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // עדכון ה-mailData עם ID של הנמען
    mailData.to = recipient.id;
    mailData.id = Emails.emails.length + 1;
    
    inboxMail.to = recipient.id;
    inboxMail.ownerId = recipient.id;
    inboxMail.id = Emails.emails.length + 2;

    // שמירת המיילים (כמו בmails.js הקיים)
    Emails.addMail(mailData);
    Emails.addMail(inboxMail);
    
    console.log('Mail saved successfully with attachments:', mailData);

    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      attachments: attachments.length
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const downloadAttachment = (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'uploads', 'files', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filepath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

module.exports = {
  upload,
  sendMail,
  downloadAttachment
};
