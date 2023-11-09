const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { username, password };

  return res
    .status(201)
    .json({ message: "Customer successfully registered, Now you can login " });
});
// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  // Use the book data from the imported module
  const booksList = JSON.stringify(books, null, 2); // Adjust the indentation level as needed

  return res.status(200).send(booksList);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnToSearch = req.params.isbn;

  // Find the book with the matching ISBN
  const foundBook = findBookByISBN(isbnToSearch);

  if (foundBook) {
    // Send the details of the found book
    return res.status(200).json(foundBook);
  } else {
    // Handle the case where the book is not found
    return res.status(404).json({ message: "Book not found" });
  }
});

// Helper function to find a book by ISBN
function findBookByISBN(isbn) {
  // Find the book with the matching ISBN
  return books[isbn];
}

// Get book details based on author

public_users.get("/author/:author", function (req, res) {
  const authorToSearch = req.params.author;

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Iterate through the 'books' array & check the author matches
  const booksByAuthor = bookKeys.reduce((result, key) => {
    const book = books[key];
    if (book.author === authorToSearch) {
      result[key] = book;
    }
    return result;
  }, {});

  if (Object.keys(booksByAuthor).length > 0) {
    // Send the details of the found books by the author
    return res.status(200).json(booksByAuthor);
  } else {
    // Handle the case where no books by the author are found
    return res.status(404).json({ message: "No books found for the author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleToSearch = req.params.title;

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Iterate through the 'books' array & check the title matches
  const booksByTitle = bookKeys.reduce((result, key) => {
    const book = books[key];
    if (book.title === titleToSearch) {
      result[key] = book;
    }
    return result;
  }, {});

  if (Object.keys(booksByTitle).length > 0) {
    // Send the details of the found books by the title
    return res.status(200).json(booksByTitle);
  } else {
    // Handle the case where no books by the title are found
    return res.status(404).json({ message: "No books found for the title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbnToSearch = req.params.isbn;

  // Find the book with the matching ISBN
  const foundBook = books[isbnToSearch];

  if (foundBook) {
    const bookReviews = foundBook.reviews;

    return res.status(200).json(bookReviews);
  } else {
    // Handle the case where the book is not found
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
