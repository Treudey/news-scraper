const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
    validate: [
      (input) => {
        return input.length <= 280;
      },
      'Your comment can only be max 145 characters long.'
    ]
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
