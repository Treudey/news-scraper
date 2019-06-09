const db = require('../models');

exports.postComment = (req, res) => {
  const { title, comment, articleID } = req.body;

  const commentObj = {
    title: title,
    body: comment
  };

  db.Comment.create(commentObj)
    .then(dbComment => {
      // If a Comment was created successfully, find the corresponding Article (using it's id) and push the new Comment's _id to the Article's `comments` array
      return db.Article.findByIdAndUpdate(articleID, { $push: { comments: dbComment._id } });
    })
    .then(() => {
      // If the Article was updated successfully, reload the main page
      res.redirect('/');
    })
    .catch(err => {
      if (err) throw err;
    });
};

exports.deleteComment = (req, res) => {

  const { articleID, commentID } = req.body;
  
  db.Comment.deleteOne({ _id: commentID})
    .then((dbComment) => {
      // If the Comment was deleted successfully, find the corresponding Article (using it's id) and remove the Comment's _id from the Article's `comments` array
      return db.Article.findByIdAndUpdate(articleID, { $pull: { comments: dbComment._id } });
    })
    .then(() => {
      // If the Article was updated successfully, reload the main page
      res.redirect('/');
    })
    .catch(err => {
      if (err) throw err;
    });
}