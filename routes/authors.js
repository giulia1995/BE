const express = require("express");
const router = express.Router();
const AuthorsModel = require("../models/authors");

// Route to fetch paginated authors
router.get("/getAuthors", async (request, response) => {
  // Pagination parameters: page number and page size
  const { page = 1, pageSize = 4 } = request.query;
  try {
    // Fetch authors based on pagination, sorted by birthday descending
    const authors = await AuthorsModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ birthday: -1 });
    // Count total authors in the database
    const totalAuthors = await AuthorsModel.countDocuments();

    response
      .status(200)
      .send({
        currentPage: +page,
        totalPages: Math.ceil(totalAuthors / pageSize),
        authors
      });
  } catch (e) {
    
    response
      .status(500)
      .send({
        statusCode: 500,
        message: "Internal server error"
      });
  }
});

// Route to fetch a single author by ID
router.get("/getAuthors/:id", async (request, response) => {
  const { id } = request.params;
  try {
    // Find author by ID
    const author = await AuthorsModel.findById(id);
    
    if (!author) {
      return response.status(404)
        .send({
          statusCode: 404,
          message: "The requested author does not exist!"
        });
    }
    
    response.status(200)
      .send(author);
  } catch (e) {
  
    response.status(500)
      .send({
        statusCode: 500,
        message: "Internal Server Error"
      });
  }
});

// Route to search authors by first name
router.get("/getAuthor/byName/:query", async (request, response) => {
  const { query } = request.params;
  try {
    // Search authors by first name using case-insensitive regex
    const author = await AuthorsModel.find({
      firstName: {
        $regex: ".*" + query + ".*",
        $options: "i",
      }
    });
    
    if (!author) {
      return response.status(404)
        .send({
          statusCode: 404,
          message: "Author not found with the given query"
        });
    }
   
    response.status(200)
      .send(author);
  } catch (e) {
   
    response.status(500)
      .send({
        statusCode: 500,
        message: "Internal Server Error"
      });
  }
});

// Route to search authors by birthday
router.get("/getAuthor/byAge/:birthday", async (request, response) => {
  const { birthday } = request.params;
  try {
    // Find authors by birthday greater than or equal to given birthday
    const authorByAge = await AuthorsModel.find({
      birthday: {
        $gte: birthday,
      }
    });
    
    response.status(200).send(authorByAge);
  } catch (e) {

    response.status(500)
      .send({
        statusCode: 500,
        message: "Internal Server Error"
      });
  }
});

// Route to create a new author
router.post("/createAuthor", async (request, response) => {
  // Create a new author object from request body
  const newAuthor = new AuthorsModel({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    birthday: request.body.birthday,
    avatar: request.body.avatar
  });
  try {
    // Save the new author to the database
    const authorToSave = await newAuthor.save();
  
    response
      .status(201)
      .send({
        statusCode: 201,
        payload: authorToSave
      });
  } catch (e) {
    
    response
      .status(500)
      .send({
        statusCode: 500,
        message: "Internal server error"
      });
  }
});

// Route to update an existing author
router.patch("/updateAuthor/:id", async (request, response) => {
  const { id } = request.params;
  try {
    // Find author by ID
    const author = await AuthorsModel.findById(id);
    
    if (!author) {
      return response
        .status(404)
        .send({
          statusCode: 404,
          message: "The requested author does not exist!"
        });
    }
    // Update author data with new values
    const updatedData = request.body;
    const options = { new: true };
    const result = await AuthorsModel.findByIdAndUpdate(id, updatedData, options);
    
    response
      .status(200)
      .send(result);
  } catch (e) {
    
    response
      .status(500)
      .send({
        statusCode: 500,
        message: "Internal server error"
      });
  }
});

// Route to delete an author by ID
router.delete("/deleteAuthor/:id", async (request, response) => {
  const { id } = request.params;
  try {
    // Find and delete author by ID
    const author = await AuthorsModel.findByIdAndDelete(id);
    // If author not found, return 404 status
    if (!author) {
      return response
        .status(404)
        .send({
          statusCode: 404,
          message: "The requested author does not exist!"
        });
    }
   
    response.status(200)
      .send(`Author with id ${id} successfully removed`);
  } catch (e) {
  
    response.status(500)
      .send({
        statusCode: 500,
        message: "Internal server error"
      });
  }
});

module.exports = router;
