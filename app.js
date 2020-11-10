const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handleServerErrors,
  handleCustomErrors,
} = require("./controllers/error-handling");

console.log("in app");
app.use(express.json());
app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
