const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true, strict: true })


module.exports = mongoose.model('userModel', UserSchema, 'users')