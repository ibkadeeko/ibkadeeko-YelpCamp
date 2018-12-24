const mongoose = require('mongoose');

commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model('Comment', commentSchema);