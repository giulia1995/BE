const express = require("express");
const books = express.Router();
const BooksModel = require("../models/books");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

// Configuring Cloudinary for external image storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuring multer for internal image storage
const internalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop();
    // Generating unique filename with current timestamp
    cb(
      null,
      `${file.fieldname} - ${new Date().toISOString()}.${fileExtension}`
    );
  },
});

// Configuring Cloudinary storage for image uploads
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "PT043", // Cloudinary folder for storing images
    public_id: (req, file) => file.name, // Using original filename for public id
  },
});

const upload = multer({ storage: internalStorage }); // Using internal storage for multer
const cloudUpload = multer({ storage: cloudStorage }); // Using Cloudinary storage for multer

// Endpoint for uploading images to Cloudinary
books.post(
  `/books/cloudUploadImg`,
  cloudUpload.single(`uploadImg`),
  async (req, res) => {
    try {
      res.status(200).json({ source: req.file.path }); // Sending Cloudinary image path
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "File Upload Error",
      });
    }
  }
);

// Endpoint for uploading images to internal file system
books.post(`/books/uploadImg`, upload.single("uploadImg"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  try {
    const imageUrl = req.file.filename;
    res.status(200).json({ source: `${url}/uploads/${imageUrl}` });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "File Upload Error",
    });
  }
});

// Other endpoints for CRUD operations on books

// Endpoint to retrieve paginated books
books.get("/books", async (req, res) => {
  const { page = 1, pageSize = 24 } = req.query; // Pagination parameters
  try {
    // Fetch books based on pagination, sorted by publication date descending
    const books = await BooksModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ pubDate: -1 });

    // Count total books in the database
    const totalBooks = await BooksModel.countDocuments();

    // Send paginated books along with pagination metadata
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

// Endpoint to create a new book
books.post(`/books/create`, async (req, res) => {
  const newBook = new BooksModel(req.body);
  try {
    // Save the new book to the database
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

// Endpoint to update an existing book
books.patch("/books/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find book by ID
    const book = await BooksModel.findById(id);
    if (!book) {
      return res.status(404).send({
        statusCode: 404,
        message: `Book with id ${id} not found!`,
      });
    }

    // Update book data with new values
    const bookToUpdate = req.body;
    const options = { new: true };
    const result = await BooksModel.findByIdAndUpdate(
      id,
      bookToUpdate,
      options
    );

    res.status(200).send(result);
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

// Endpoint to delete a book by ID
books.delete("/books/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete book by ID
    const book = await BooksModel.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).send({
        statusCode: 404,
        message: "The requested book not exist!",
      });
    }

    res.status(200).send(`Book with id ${id} successfully removed`);
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

module.exports = books;
