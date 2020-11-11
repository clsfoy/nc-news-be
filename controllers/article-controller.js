const {
  fetchArticleById,
  patchArticleById,
  sendNewComment,
  removeArticleById,
  fetchCommentsByArticleId,
  fetchAllArticles,
  // uploadNewArticle,
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

//GOING TO COME BACK TO THIS
// const postNewArticle = (req, res, next) => {
//   const body = req.body;

//   uploadNewArticle(body).then((newArticle) => {
//     res.status(201).send({ newArticle });
//   });
// };

module.exports = {
  getArticleById,
  updateArticleById,
  postNewComment,
  deleteArticleById,
  getCommentsByArticleId,
  getAllArticles,
  // postNewArticle,
};
