const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
secretKey = "yourSessionSecret";
const users = {
  test: {
    username: "test",
    password: "test123", // Store hashed and salted passwords in production
  },
  jane_smith: {
    username: "jane_smith",
    password: "hashed_password_2",
  },
  // Add more users as needed
};

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username exists and the password matches
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token for the session
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

  // Save the user credentials in the session (you might want to use a more secure storage)
  req.session.user = { username, token };

  // Send the JWT token in the response
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
