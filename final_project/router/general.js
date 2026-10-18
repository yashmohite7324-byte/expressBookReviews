const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Helper function to get book list using Promise / Async-Await
const getBookList = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

// Get the book list available in the shop (Task 1 & Task 10 using async/await with Promise)
public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBookList();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 11: Helper function to get book by ISBN using Promise / Async-Await
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });
};

// Get book details based on ISBN (Task 2 & Task 11 using async/await with Promise)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 12: Helper function to get books by author using Promise / Async-Await
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchingBooks = [];
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: `No books found for author ${author}` });
    }
  });
};

// Get book details based on author (Task 3 & Task 12 using async/await with Promise)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksFound = await getBooksByAuthor(author);
    return res.status(200).json(booksFound);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 13: Helper function to get books by title using Promise / Async-Await
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchingBooks = [];
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: `No books found for title ${title}` });
    }
  });
};

// Get all books based on title (Task 4 & Task 13 using async/await with Promise)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksFound = await getBooksByTitle(title);
    return res.status(200).json(booksFound);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Get book review (Task 5)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

module.exports.general = public_users;
