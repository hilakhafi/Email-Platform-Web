const Users = require('../models/users');

// Authenticate user by email and password
exports.findUser = (req, res) => {

  const { mail, password } = req.body;

  const user = Users.findUser(mail, password);
  // Successful login, return user ID
  if (user) {
    res.status(200).json({ userId: user.id });
  } else {
    // Invalid credentials
    res.status(404).json({ error: "Invalid credentials" });
  }
};

exports.verifyMail = (req, res) => {
  const { mail } = req.body;

  const user = Users.getUserByMail(mail);

  if (user) {
    res.sendStatus(200); // Email found
  } else {
    res.status(404).json({ error: "Email not found" });
  }
};
