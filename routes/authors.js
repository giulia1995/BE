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

router.post("/createAuthor", async (request, response )=>{
    const newAuhtor = new AuthorsModel({
       firstName:request.body.firstName,
       lastName: request.body.lastName,
       email:request.body.email,
       birth: Number(request.body.birth)

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


module.exports = router;