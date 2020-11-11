const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePSQLerrors,
  send405,
  handleInvalidRoutes,
} = require("./controllers/error-handling");

console.log("in app");
app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", handleInvalidRoutes);

app.use(handleCustomErrors);
app.use(handleInvalidRoutes);
app.use(handlePSQLerrors);
app.use(handleServerErrors);
app.use(send405);

module.exports = app;
