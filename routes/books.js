const express = require("express");
const books = express.Router();
const BooksModel = require("../models/books");
//const logger = require("../middlewares/logger");

books.get("/books", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const books = await BooksModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ pubDate: -1 });

    const totalBooks = await BooksModel.countDocuments();

    res.status(200).send({
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalBooks / pageSize),
      books,
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

books.post("/books/create", async (req, res) => {
  const newBook = new BooksModel({
    author: req.body.author,
    title: req.body.title,
    editor: req.body.editor,
    cover: req.body.cover,
    price: Number(req.body.price),
    description: req.body.description,
    pudDate: new Date(req.body.pubDate),
    isFeatured: req.body.isFeatured,
  });
  try {
    await newBook.save();
    res.status(201).send({
      statusCode: 201,
      payload: "Book saved successfully",
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

module.exports = books;
