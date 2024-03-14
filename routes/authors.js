const express = require("express");
const router = express.Router();
const AuthorsModel = require("../models/authors");

router.get("/getAuthors", async ( request, response)=>{
    try{
       const authors = await AuthorsModel.find();
       response
       .status(200)
       .send(authors)
    } catch(e){
      response
      .status(500)
      .send({
        statusCode: 500,
        message: "Internal server error"
      })
    }
})

router.get("/getAuthors/:id", async (request, response)=>{
  const {id} = request.params;
  try{
   const author = await AuthorsModel.findById(id);
   if (!author){
    return response.status(404)
    .send({
      statusCode:404,
      message:"The requested author does not exist!"
    })
   }
   response.status(200)
   .send(author)
  }catch(e){
   response.status(500)
   .send({
    statusCode:500,
    message:"Internal Server Error"
   })
  }
})
router.get("/getAuthor/byName/:query", async (request, response)=>{
  const {query} = request.params;
  try{
    const author = await AuthorsModel.find({
      firstName:{
        $regex: ".*" + query + ".*",
        $options: "i",
      }
    })
    if(!author){
      return response.status(404)
      .send({
        statusCode:404,
        message: "Author not found with the given query"
      })
    }
    response.status(200)
    .send(author);
  }catch(e){
    response.status(500)
   .send({
    statusCode:500,
    message:"Internal Server Error"
   })
  }
})
router.get("/getAuthor/byAge/:age", async (request, response)=>{
  const {age} = request.params;
  try{
   const authorByAge = await  AuthorsModel.find({
    age: {
      $gte: age,
      
    }
   })
   response.status(200).send(authorByAge)
  }catch(e){
    response.status(500)
    .send({
     statusCode:500,
     message:"Internal Server Error"
    })
  }
})

router.post("/createAuthor", async (request, response )=>{
    const newAuhtor = new AuthorsModel({
       firstName:request.body.firstName,
       lastName: request.body.lastName,
       email:request.body.email,
       birthday: request.body.birthday,
       avatar:request.body.avatar
    });
    try{
      const authorToSave = await newAuhtor.save();
      response
      .status(201)
      .send({
        statusCode:201,
        payload: authorToSave
      })
    } catch(e){
      response
      .status(500)
      .send({
        statusCode:500,
        message: "Internal server error"
      } )
    }
})
router.patch("/updateAuthor/:id", async (request, response)=>{
  const {id} = request.params
  try{
    const author = await AuthorsModel.findById(id);
    if(!author){
       return response
       .status(404)
       .send({
        statusCode:404,
        message: "The requested author not exist!"
       })
    }
    const updatedData = request.body;
    const options = {new: true};

    const result = await AuthorsModel.findByIdAndUpdate(id, updatedData, options);
    response
           .status(200)
           .send(result)

  }catch(e){
    response
      .status(500)
      .send({
        statusCode:500,
        message: "Internal server error"
      })
  }
})

router.delete("/deleteAuthor/:id", async (request, response)=>{
  const {id} = request.params;
  try{
       const author = await AuthorsModel.findByIdAndDelete(id);
       if (!author){
        return response
       .status(404)
       .send({
        statusCode:404,
        message: "The requested author not exist!"
       })
       }
       response.status(200)
       .send("Author with id ${id} successfully removed")

  }catch(e){

  }
})

module.exports = router;