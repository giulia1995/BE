const mongoose = require ("mongoose");

const AuthorSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        max: 255
    },
    birthday: {
        type: String,
        required: true,
        max: 255
    },
    avatar: {
        type: String,
        required: true,
        max: 255
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model("authorModel", AuthorSchema, "authors")