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
      // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
      return db.Article.findByIdAndUpdate(articleID, { $push: { comments: dbComment._id } }, { new: true });
    })
    .then(dbArticle => {
      // If the Article was updated successfully, send it back to the client
      res.redirect('/');
    })
    .catch(err => {
      if (err) throw err;
    });
};