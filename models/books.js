const mongoose = require ("mongoose");
const BookSchema = new mongoose.Schema ({
    author:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        max: 150
    },
    editor: {
        type: String,
        required: false,
        default: "Not provided"
    },
    cover: {
        type: String,
        required: false,
        default: "https://picsum.photos/600/400"
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        default: 0.0
    },
    description: {
         type: String,
         required: true,
    },
    pubDate:{
        type: Date,
        required: false,
    },
    isFeatured:{
        type: Boolean,
        required: false,
        default: false
    }


} ,{timestamps: true , strict: true})

module.exports = mongoose.model("booksModel", BookSchema, "books")