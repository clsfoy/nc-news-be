const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const {createTopicReference} = require('../utils/data-manipulation')

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
      const topicReference = createTopicReference(topicRows)
    })
  
};
