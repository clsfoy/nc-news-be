const usersRouter = require("express").Router();
const dbConfig = require("../knexfile");
const { getUserByUsername } = require("../controllers/users-controller");

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
