const dbConfig = require("../knexfile");
const { fetchAllTopics, createNewTopic } = require("../models/topics-model");

const getAllTopics = (req, res, next) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

const addNewTopic = (req, res, next) => {
  const newTopic = req.body;
  createNewTopic(newTopic)
    .then((createdTopic) => {
      res.status(201).send({ createdTopic });
    })
    .catch(next);
};

module.exports = { getAllTopics, addNewTopic };
