const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");

// Endpoint for user login
login.post("/login", async (req, res) => {
    try {
        // Find user by email
        const user = await UserModel.findOne({ email: req.body.email });

        // If user does not exist, return 404 error
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "This user does not exist!"
            });
        }

        // Compare entered password with hashed password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        // If password is not valid, return 401 unauthorized error
        if (!isPasswordValid) {
            return res.status(401).send({
                statusCode: 401,
                message: "Unauthorized"
            });
        }

        // Generate JWT token with user information and set expiration time
        const token = jwt.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }, process.env.SECRET_KEY, {
            expiresIn: "24h"
        });

        // Set Authorization header with token and send success response
        res.header("Authorization", token).status(200).send({
            message: "Login successful",
            statusCode: 200,
            token
        });

    } catch (e) {
        // Handle internal server error
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500
        });
    }
});

module.exports = login;
