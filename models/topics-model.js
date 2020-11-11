const connection = require("../db/connection");

const fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

const createNewTopic = (newTopic) => {
  return connection("topics").insert(newTopic).returning("*");
};

module.exports = { fetchAllTopics, createNewTopic };
