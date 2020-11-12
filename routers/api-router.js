const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articleRouter = require("./article-router");
const commentsRouter = require("./comments-router");
const apiEndPoints = require("../endpoints.json");
console.log("in api router");

apiRouter.route("/").get((req, res, next) => {
  res.status(200).send({ apiEndPoints });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
