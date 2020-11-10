const {
  fetchArticleById,
  patchArticleById,
  sendNewComment,
  removeArticleById,
} = require("../models/article-models");

const getArticleById = (req, res, next) => {
  console.log("inside article controller");
  const articleId = req.params.article_id;

  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const updateArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const newVoteCount = req.body.inc_votes;

  patchArticleById(articleId, newVoteCount)
    .then((updatedArticle) => {
      res.status(201).send({ updatedArticle });
    })
    .catch(next);
};

const deleteArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  removeArticleById(articleId)
    .then(() => {
      res.status(204).send({ msg: "Article deleted!" });
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  updateArticleById,

  deleteArticleById,
};
