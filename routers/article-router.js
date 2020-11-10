const articleRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  deleteArticleById,
} = require("../controllers/article-controller");

const { postNewComment } = require("../controllers/comments-controller");

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticleById);

articleRouter.route("/:article_id/comments").post(postNewComment);

module.exports = articleRouter;
