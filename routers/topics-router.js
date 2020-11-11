const topicsRouter = require("express").Router();
const dbConfig = require("../knexfile");
const {
  getAllTopics,
  addNewTopic,
} = require("../controllers/topics-controller");
const { send405 } = require("../controllers/error-handling");

topicsRouter.route("/").get(getAllTopics).post(addNewTopic).all(send405);

module.exports = topicsRouter;
