const topicsRouter = require("express").Router();
const dbConfig = require("../knexfile");
const { getAllTopics } = require("../controllers/topics-controller");

topicsRouter.route("/").get(getAllTopics);

module.exports = topicsRouter;
