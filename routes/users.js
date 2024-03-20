const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const bcrypt = require ("bcrypt");

router.get("/getUsers", async (req, res)=>{
    const { page = 1, pageSize = 5} = req.query;
    try{
    const users = await UserModel.find()
    .limit (pageSize)
    .skip((page - 1) * pageSize)
    const totalUsers = await UserModel.countDocuments();
    res
    .status(200)
    .send({
        currentPage: +page,
        totalPages: Math.ceil(totalUsers / pageSize),
        users,
    })
    }catch(e){
        res
        .status(500)
        .send({
            statusCode: 500,
            message: "Internal server error"
        })

    }
})

router.get("/getUsers/:id", async (req, res)=>{
    const { id } = req.params;
    try{
    const user = await UserModel.findById(id);
    if(!user){
        return res 
        .status(404)
        .send({
            statusCode: 404,
            message: "The requested user does not exist!"
        })
    }
    res
    .status(200)
    .send(user)
    }catch(e){
    res
    .status(500)
    .send({
       statusCode:500,
       message: "Internal Server Error" 
    })
    }
})

router.post("/createUser", async (req, res)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    
    const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        age: Number(req.body.age)
    });
    try{
        const userToSave = await newUser.save();
        res
        .status(201)
        .send({
            statusCode:201,
            payload: userToSave
        })
    }catch(e){
        res
        .status(500)
        .send({
          statusCode:500,
          message: "Internal server error"
        } )    
    }
})

router.patch("/updateUser/:id", async (req, res)=>{
    const {id} = req.params;
    const user = await UserModel.findById(id);
    if (!user){
        return res 
        .status(404)
        .send({
            statusCode: 404,
            message: "The requested user not exist!"
        })
    }
    try{
        const updatedData = req.body;
        const options = {new: true};
        const result = await UserModel.findByIdAndUpdate(id, updatedData, options);
         
        res
        .status(200)
        .send(result)
    } catch (e){
        res
        .status(500)
        .send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

router.delete ("/deleteUser/:id", async (req, res)=>{
    const {id} = req.params;
    try{
        const user = await UserModel.findByIdAndDelete(id);
        if (!user){
            return res
            .status (404)
            .send({
                statusCode:404,
                message: "The requested user not exist!"
            })
        } 
        res
        .status(200)
        .send("User with id ${id} successfully removed!")
    } catch (e){
        res
        .status(500)
        .send({
            statusCode:500,
            message: "Internal server error"
        })
    }
    
})

module.exports = router;