const { all } = require("../app");
const connection = require("../db/connection");

const fetchArticleById = (articleId) => {
  return connection("articles")
    .select("articles.*")
    .count("comment_id as comment_count")
    .where("articles.article_id", "=", articleId)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
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

const fetchCommentsByArticleId = (articleId, query) => {
  const sortKey = query.sort_by || "author";
  const sortOrder = query.order || "desc";
  const limit = query.limit || "10";
  const offset = (query.p - 1) * limit || "0";

  return connection("comments")
    .select("*")
    .where("article_id", "=", articleId)
    .orderBy(sortKey, sortOrder)
    .limit(limit)
    .offset(offset);
};

const patchArticleById = (articleId, newVoteCount) => {
  return connection("articles")
    .where("articles.article_id", "=", articleId)
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

const sendNewComment = (commentToAdd, articleId) => {
  const userName = commentToAdd.username;
  const body = commentToAdd.body;

  const comment = {
    author: userName,
    article_id: articleId,
    body: body,
  };
  if (userName.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Please provide a registered username",
    });
  } else {
    return connection("comments").insert(comment).returning("*");
  }
};

const fetchAllArticles = (query) => {
  const sortKey = query.sort_by || "created_at";
  const sortOrder = query.order || "desc";
  const limit = query.limit || "10";
  const offset = (query.p - 1) * limit || "0";

  return connection("articles")
    .select("articles.*")
    .count("comment_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sortKey, sortOrder)
    .limit(limit)
    .offset(offset)
    .where((builder) => {
      if (query.author) builder.where("articles.author", "=", query.author);
      if (query.topic) builder.where("articles.topic", "=", query.topic);
    });
};

const checkArticleExists = (articleId) => {
  return (
    connection("articles").where("article_id", "=", articleId),
    then((article) => {
      if (article.length === 0) return false;
      else return true;
    })
  );
};

const uploadNewArticle = (body) => {
  return connection.insert(body).into("articles").returning("*");
};

const getTotalArticleCount = (query) => {
  return connection("articles")
    .count("* as total_count")
    .where((builder) => {
      if (query.author) builder.where("articles.author", "=", query.author);
      if (query.topic) builder.where("articles.topic", "=", query.topic);
    });
};

module.exports = {
  fetchArticleById,
  patchArticleById,
  sendNewComment,
  removeArticleById,
  fetchCommentsByArticleId,
  fetchAllArticles,
  checkArticleExists,
  uploadNewArticle,
  getTotalArticleCount,
};
