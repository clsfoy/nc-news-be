const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const { createArticleRef, dateFormatter } = require('../utils/data-manipulation')

exports.seed = function (knex) {
  // add seeding functionality here

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicData)
        .returning('*')
    }).then((topicRows) => {
      return knex('users')
        .insert(userData)
        .returning('*')
    }).then((userRows) => {
      const formattedArticles = dateFormatter(articleData)
      return knex('articles')
        .insert(formattedArticles)
        .returning('*')
    }).then((articleRows) => {
      const articleRef = createArticleRef(articleRows)
      const formateComments = formateComments(commentData, articleRef)
      return knex('comments')
        .insert(formateComments)
        .returning('*')

    })

};
