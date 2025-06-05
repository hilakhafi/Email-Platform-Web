const Users = require('../models/users');

// Get a user by ID
exports.getUser = (req, res) => {
  req.headers['user-id'];
  const id = req.params.id;
  const user = Users.getUser(id);
  if (user) {
    // User found
    res.status(200).json(user);
  } else {
    // User not found
    res.status(404).json({ error: "User not found" });
  }
};

// Add a new user
exports.addUser = (req, res) => {
  const { mail, first_name, last_name, birth_date, gender, password, picture } = req.body;
  // Check if email is already registered
  const existingUser = Users.getUserByMail(mail);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  // Add new user to the system
  Users.addUser({ mail, first_name, last_name, birth_date, gender, password, picture });
  res.status(201).json();
};
