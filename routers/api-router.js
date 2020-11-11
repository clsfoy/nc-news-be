const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articleRouter = require("./article-router");
const commentsRouter = require("./comments-router");
console.log("in api router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
