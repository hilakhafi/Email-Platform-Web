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

exports.getUserByUsername = (username) => {
  return Users.users.find(user => user.username === username);
};

// Add a new user
exports.addUser = (req, res) => {
  const { mail, first_name, last_name, username, birth_date, gender, password, reWritePass, picture } = req.body;

  // validating that all fields are provided
  if (!mail || !first_name || !last_name || !username || !birth_date || !gender || !password || !reWritePass || !picture) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // validating that the email is in a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(mail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // valid that the password is at least 8 characters long and contains letters and numbers
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters long and contain letters and numbers" });
  }

  // validating that the passwords match
  if (password !== reWritePass) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // validating first and last names (at least 2 letters, only letters)
  const nameRegex = /^[A-Za-zא-ת]{2,}$/;
  if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
    return res.status(400).json({ error: "First and last names must contain at least 2 letters and only letters" });
  }

  // validdation for birth date
  if (isNaN(Date.parse(birth_date))) {
    return res.status(400).json({ error: "Invalid birth date format" });
  }

  // valid gender values
  const allowedGenders = ['male', 'female'];
  if (!allowedGenders.includes(gender.toLowerCase())) {
    return res.status(400).json({ error: "Invalid gender value" });
  }

  // cjeck if email already exists
  const existingUser = Users.getUserByMail(mail);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // check if username already exists
  const existingUserByUsername = Users.getUserByUsername(username); 
  if (existingUserByUsername) {
    return res.status(400).json({ error: "Username already exists" });
  }

// adding the user
  if (!picture) { // need to check if picture is provided ------?
    picture = "https://example.com/default-profile-picture.png"; // תמונה ברירת מחדל אם לא ניתנה
  }
  Users.addUser({mail, first_name, last_name, username, birth_date, gender, password, reWritePass, picture });

  res.status(201).json({ message: "User added successfully" });
};

