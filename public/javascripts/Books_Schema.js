const mongoose = require('mongoose');


let Books = new mongoose.Schema({
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true
    },
    BookTitle: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    BookThumbnail:{
        type: String,
        required: true
    },
    interestedUsers:{
        type:Array,
        maxlength:1,
        default:[]
    }
});

let BooksSchema = mongoose.model("booksDetails", Books);

module.exports = { BooksSchema };