const { sendNewComment } = require("../models/comments-models");

const postNewComment = (req, res, next) => {
  console.log("inside controller");
  const articleId = req.params.article_id;
  const commentToPost = req.body;

  sendNewComment(commentToPost, articleId)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

module.exports = { postNewComment };
