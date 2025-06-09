const Users = require('../models/users');
const jwt = require('jsonwebtoken'); 

const SECRET_KEY = 'secretkeyHHE';
// Generate a JWT token for the user
// Authenticate user by email and password
exports.findUser = (req, res) => {

  const { mail, password } = req.body;

  const user = Users.findUser(mail, password);
  // Successful login, return user ID
  if (user) {
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    // Set the token in the response header
    res.status(200).json({ userId: user.id, token: token });
  } else {
    // Invalid credentials
    res.status(404).json({ error: "Invalid credentials" });
  }
};