const usersRouter = require("express").Router();
const dbConfig = require("../knexfile");
const {
  getUserByUsername,
  updateUserInfo,
  getAllUsers,
} = require("../controllers/users-controller");
const { send405 } = require("../controllers/error-handling");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(updateUserInfo)
  .all(send405);

usersRouter.route("/").get(getAllUsers);

module.exports = usersRouter;
