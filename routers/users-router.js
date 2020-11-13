const usersRouter = require("express").Router();
const dbConfig = require("../knexfile");
const {
  getUserByUsername,
  updateUserInfo,
} = require("../controllers/users-controller");
const { send405 } = require("../controllers/error-handling");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(updateUserInfo)
  .all(send405);

module.exports = usersRouter;
