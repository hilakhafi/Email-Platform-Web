const Emails = require('../models/mails');
const Users = require('../models/users');
const BlacklistServer = require('../services/BlacklistServer');

// Get the 50 most recent emails related to the user
exports.get50Emails = (req, res) => {
  const userId = parseInt(req.headers['user-id'], 10);

  const relaventEmails = Emails.emails
    .filter(e => e.from === userId || e.to === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);

    res.json(relaventEmails);
};

// Get a single email by ID
exports.getMail = (req, res) => {
  req.headers['user-id'];
  const id = req.params.id;
  const mail = Emails.getMail(id);
  if (mail) {
    res.status(200).json(mail);
  } else {
    res.status(404).json({ error: "Mail not found" });
  }
};

// Update certain fields in a specific email
exports.patchMail = (req, res) => {
  //header
  const userId = parseInt(req.headers['user-id'], 10);
  const id = req.params.id;
  const mail = Emails.getMail(id); 

  if (!mail) {
    return res.status(404).json({ error: "Mail not found" });
  }

  // change body
  const allowedFields = ['subject', 'body', 'isRead', 'link'];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      mail[field] = req.body[field];
    }
  }
  //save changes
  Emails.patchMail(id, mail); 

  res.status(200).json();
};

// Delete a specific email
exports.deleteMail = (req, res) => {
  //header
  const userId = parseInt(req.headers['user-id'], 10);
  const id = req.params.id;
  const mail = Emails.getMail(id); 

  if (!mail) {
    return res.status(404).json({ error: "Mail not found" });
  }

  //save changes
  Emails.deleteMail(id); 

  res.status(204).json();
};

// Send a new email
exports.postMail = async (req, res) => {
  try {
    const userId = parseInt(req.headers['user-id'], 10); 
    const user = Users.getUser(userId);
    const { sendTo, subject, body } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ error: 'Missing or invalid user-id header' });
    }
    // check if the user exists    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // check if the recipient exists
    const recipient = Users.getUserByMail(sendTo);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    if (!sendTo || !subject || !body) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const block = await BlacklistServer.check(subject, body);

    if (block) {
      return res.status(400).json({ error: 'URL is blacklisted' });
    }

    const newMail = {
      id: Emails.emails.length + 1,
      from: userId,     
      to: recipient.id,
      subject,
      body,
      timestamp: new Date().toISOString()
    };

    Emails.addMail(newMail); 

    return res.status(201).json({});

  } catch (err) {
    console.error("Error in postMail:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Search emails by query string
exports.searchEmails = (req, res) => {
  const query = req.params.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = Emails.search(query);
  res.status(200).json(results);
};
