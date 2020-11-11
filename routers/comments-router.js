const commentsRouter = require("express").Router();
const {
  updateCommentVoteById,
  deleteCommentById,
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentVoteById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
