const connection = require("../db/connection");

const fetchArticleById = (articleId) => {
  return connection("articles")
    .select("articles.*")
    .count("* as comment_count")
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

  return connection("comments")
    .select("*")
    .where("article_id", "=", articleId)
    .orderBy(sortKey, sortOrder);
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

  return connection("articles")
    .select("articles.*")
    .count("* as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sortKey, sortOrder)
    .where((builder) => {
      if (query.author) builder.where("articles.author", "=", query.author);
      if (query.topic) builder.where("articles.topic", "=", query.topic);
    });
};

// GOING TO COME BACK TO THIS
// const uploadNewArticle = (body) => {
//   const newArticle = connection("articles")
//     .insert(body)
//     .returning("*")
//     .then((newArticle) => {
//       console.log(newArticle);
//       return connection("topics").select;
//     });
// };

module.exports = {
  fetchArticleById,
  patchArticleById,
  sendNewComment,
  removeArticleById,
  fetchCommentsByArticleId,
  fetchAllArticles,
  // uploadNewArticle,
};
