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

  // בדיקה שכל השדות מלאים
  if (!mail || !first_name || !last_name || !username || !birth_date || !gender || !password || !reWritePass) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ולידציה בסיסית למייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(mail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // ולידציה בסיסית לסיסמה - לפחות 8 תווים, אותיות ומספרים
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters long and contain letters and numbers" });
  }

  // ווידוא שסיסמא ואימות סיסמא תואמים
  if (password !== reWritePass) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // ולידציה לשם פרטי ומשפחה (לדוגמה: לפחות 2 תווים, רק אותיות)
  const nameRegex = /^[A-Za-zא-ת]{2,}$/;
  if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
    return res.status(400).json({ error: "First and last names must contain at least 2 letters and only letters" });
  }

  // ולידציה ל־birth_date (פורמט ISO לדוגמה YYYY-MM-DD)
  if (isNaN(Date.parse(birth_date))) {
    return res.status(400).json({ error: "Invalid birth date format" });
  }

  // ולידציה ל־gender (למשל רק 'male' או 'female')
  const allowedGenders = ['male', 'female'];
  if (!allowedGenders.includes(gender.toLowerCase())) {
    return res.status(400).json({ error: "Invalid gender value" });
  }

  // בדיקת אם המייל כבר רשום
  const existingUser = Users.getUserByMail(mail);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // בדיקת אם שם משתמש כבר קיים
  const existingUserByUsername = Users.getUserByUsername(username); // ודא שהפונקציה הזאת קיימת
  if (existingUserByUsername) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // הוספת המשתמש
  Users.addUser({mail, first_name, last_name, username, birth_date, gender, password, reWritePass, picture });

  res.status(201).json({ message: "User added successfully" });
};

