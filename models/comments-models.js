const connection = require("../db/connection");

const patchCommentVoteById = (newVoteCount, commentId) => {
  return connection("comments")
    .where("comments.comment_id", "=", commentId)
    .increment("votes", newVoteCount)
    .returning("*");
};

const removeCommentById = (commentId) => {
  return connection
    .del()
    .from("comments")
    .where("comment_id", "=", commentId)
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found - nothing to delete",
        });
      }
    });
};

module.exports = { patchCommentVoteById, removeCommentById };
