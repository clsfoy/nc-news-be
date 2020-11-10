const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const {
  createArticleRef,
  dateFormatter,
  formatComments,
} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  // add seeding functionality here

  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("topics").insert(topicData).returning("*");
    })
    .then((topicRows) => {
      console.log("adding topics");
      return knex("users").insert(userData).returning("*");
    })
    .then((userRows) => {
      const formattedArticleData = dateFormatter(articleData);
      console.log("adding articles");
      return knex("articles").insert(formattedArticleData).returning("*");
    })
    .then((articleRows) => {
      const articleRef = createArticleRef(articleRows);
      const formattedCommentDate = dateFormatter(commentData);
      const formattedComments = formatComments(
        formattedCommentDate,
        articleRef
      );
      return knex("comments").insert(formattedComments).returning("*");
    });
};
