const articleRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postNewComment,
  deleteArticleById,
  getCommentsByArticleId,
  getAllArticles,
  postNewArticle,
} = require("../controllers/article-controller");

const { send405 } = require("../controllers/error-handling");

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticleById);

articleRouter
  .route("/:article_id/comments")
  .post(postNewComment)
  .get(getCommentsByArticleId)
  .all(send405);

articleRouter.route("/").get(getAllArticles).post(postNewArticle);

module.exports = articleRouter;
