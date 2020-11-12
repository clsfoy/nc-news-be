const {
  fetchArticleById,
  patchArticleById,
  sendNewComment,
  removeArticleById,
  fetchCommentsByArticleId,
  fetchAllArticles,
  checkArticleExists,
  uploadNewArticle,
} = require("../models/article-models");

const getArticleById = (req, res, next) => {
  console.log("inside article controller");
  const articleId = req.params.article_id;

  fetchArticleById(articleId)
    .then((article) => {
      if (article.length === 0) {
        return Promise.all([article, checkArticleExists(articleId)]);
      } else return [article, true];
    })
    .then(([article, articleExists]) => {
      if (!articleExists) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
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

const postNewComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const commentToPost = req.body;

  sendNewComment(commentToPost, articleId)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const query = req.query;
  fetchCommentsByArticleId(articleId, query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const getAllArticles = (req, res, next) => {
  const query = req.query;

  fetchAllArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const postNewArticle = (req, res, next) => {
  const body = req.body;

  uploadNewArticle(body)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  updateArticleById,
  postNewComment,
  deleteArticleById,
  getCommentsByArticleId,
  getAllArticles,
  postNewArticle,
};
