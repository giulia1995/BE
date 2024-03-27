const express = require("express");
const books = express.Router();
const BooksModel = require("../models/books");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {cloudinaryStorage, CloudinaryStorage} = require('multer-storage-cloudinary');
require('dotenv').config()

//archivio esterno su cloudinary per immagini
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

//filesistem interno per archivio immagini interno
const internalStorage= multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop()
    cb(null, `${file.fieldname} - ${new Date().toISOString()}.${fileExtension}`)
  }
})

const cloudStorage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params:{
      folder: 'PT043',
      //format: async (req, file) => 'png',
      public_id: (req, file) => file.name
     }
})

const upload = multer({storage: internalStorage})
const cloudUpload = multer({storage: cloudStorage})

books.post('/books/cloudUploadImg', cloudUpload.single('uploadImg'), async (req, res)=>{
  try{
    res.status(200).json({source: req.file.path})

  }catch(e){
    res.status(500)
    .send({
      statusCode: 500,
      message:'File Upload Error'
    })
  }
})


books.post('/books/uploadImg', upload.single('uploadImg'), async (req, res)=>{
  const url = req.protocol + '://' + req.get('host');
  try{
    const imageUrl = req.file.filename
    res.status(200).json({source: `${url}/uploads/${imageUrl}`})

  }catch(e){
    res.status(500)
    .send({
      statusCode: 500,
      message:'File Upload Error'
    })
  }
})




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
