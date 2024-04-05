const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    commenter: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booksModel",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("commentModel", CommentSchema, "comments");
