const connection = require("../db/connection");

const sendNewComment = (commentToAdd, articleId) => {
  const userName = commentToAdd.userName;
  const comment = commentToAdd.body;

  console.log("inside model");
  return connection("comments")
    .insert({ articleId, author: userName, body: comment })
    .returning("*");
};

module.exports = { sendNewComment };
