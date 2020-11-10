const connection = require("../db/connection");

const fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

module.exports = { fetchAllTopics };
