const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const sendMail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const attachments = req.files || [];

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, 'your-secret-key');
    const userId = decoded.userId;

    const mailData = {
      ownerId: userId,
      from: userId,
      to: parseInt(to),
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
      ownerId: parseInt(to)
    };

    // await saveMail(mailData);
    // await saveMail(inboxMail);

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
    const filepath = path.join(__dirname, '..', 'uploads', 'attachments', filename);

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
  sendMail,
  downloadAttachment
};
