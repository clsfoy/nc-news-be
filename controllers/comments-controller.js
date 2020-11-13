const {
  patchCommentVoteById,
  removeCommentById,
} = require("../models/comments-models");

const updateCommentVoteById = (req, res, next) => {
  const newVoteCount = req.body.inc_votes;
  const commentId = req.params.comment_id;
  patchCommentVoteById(newVoteCount, commentId)
    .then((updatedComment) => {
      res.status(201).send({ updatedComment });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { updateCommentVoteById, deleteCommentById };
