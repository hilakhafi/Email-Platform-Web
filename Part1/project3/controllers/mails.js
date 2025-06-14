const Emails = require('../models/mails');
const Users = require('../models/users');

// Get the 50 most recent emails related to the user
exports.get50Emails = (req, res) => {
  const userId = req.user.userId; 
  const relaventEmails = Emails.emails
    .filter(e => e.from === userId || e.to === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);

    res.json(relaventEmails);
};

// Get a single email by ID
exports.getMail = (req, res) => {
  const id = req.params.id;
  const mail = Emails.getMail(id);
  if (mail) {
    if (mail.from !== req.user.id && mail.to !== req.user.id) {
       return res.status(403).json({ error: "Access denied" });
  }
    res.status(200).json(mail);
  } else {
    res.status(404).json({ error: "Mail not found" });
  }
};

// Update certain fields in a specific email
exports.patchMail = (req, res) => {
  //header
  const userId = req.user.userId;
  const id = req.params.id;
  const mail = Emails.getMail(id); 

  if (!mail) {
    return res.status(404).json({ error: "Mail not found" });
  }
  if (mail.from !== userId && mail.to !== userId) {
  return res.status(403).json({ error: "Access denied" });
}

  // change body
  const allowedFields = ['subject', 'body', 'isRead', 'link', 'category', 'isStarred', 'previousCategory'];
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
  const userId = req.user.userId;
  const id = req.params.id;
  const mail = Emails.getMail(id); 

  if (!mail) {
    return res.status(404).json({ error: "Mail not found" });
  }
   if (mail.from !== userId && mail.to !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

  //save changes
  Emails.deleteMail(id); 

  res.status(204).json();
};

// Send a new email
exports.postMail = async (req, res) => {
  console.log(req.user);
  console.log("Decoded user from token:", req.user);
  try {
    const userId = req.user.userId; 
    console.log("User ID from token:", userId);
    const user = Users.getUser(userId);
    const { sendTo, subject, body } = req.body;
    // validating that the email is in a valid format

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sendTo)) {
      return res.status(400).json({ error: "Invalid email format" });
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
    console.log("Calling BlacklistServer.check");
    //const isSpam = await BlacklistServer.check(subject, body); 
    //console.log("isSpam result:", isSpam);
    const preview = body.substring(0, 20) + '...'; 
    
    const SentMail = {
      id: Emails.emails.length + 1,
      ownerId: userId,
      from: userId,     
      to: recipient.id,
      subject,
      body,
      timestamp: new Date().toISOString(),
      // spam: isSpam, // Check if the email is spam
      //spam: false, // For now, we assume the email is not spam
      preview,
      isRead: false,
      category: 'sent', // Indicate that this is a sent email
      previousCategory: 'sent', // Store the previous category for future reference
      isStarred: false, // Default value for isStarred
    };

    const InboxMail = {
      id: Emails.emails.length + 2,
      ownerId: recipient.id,
      from: userId,     
      to: recipient.id,
      subject,
      body,
      timestamp: new Date().toISOString(),
      //spam: isSpam, // Check if the email is spam
      //spam: false, // For now, we assume the email is not spam
      preview,
      isRead: false,
      category: 'inbox', // Indicate that this is an inbox email
      previousCategory: 'inbox', // Store the previous category for future reference
      isStarred: false, // Default value for isStarred
    };

    Emails.addMail(SentMail); 
    Emails.addMail(InboxMail); 


    console.log(Emails.emails);
    return res.status(201).json({});

  } catch (err) {
    console.error("Error in postMail:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Search emails by query string
exports.searchEmails = (req, res) => {
  const userId = req.user.userId;
  const query = req.params.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  const results = Emails.search(query);
  res.status(200).json(results);
};
