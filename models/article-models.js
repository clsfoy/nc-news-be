const connection = require("../db/connection");

const fetchArticleById = (articleId) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", articleId)
    .returning("*")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return article;
    });
};

const patchArticleById = (articleId, newVoteCount) => {
  return connection("articles")
    .where("article_id", "=", articleId)
    .increment("votes", newVoteCount)
    .returning("*")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found - update unsuccessful",
        });
      }
      return article;
    });
};

const removeArticleById = (articleId) => {
  return connection
    .del()
    .from("articles")
    .where("article_id", "=", articleId)
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found - nothing to delete",
        });
      }
    });
};

module.exports = {
  fetchArticleById,
  patchArticleById,

  removeArticleById,
};
