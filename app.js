const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const cors = require("cors");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePSQLerrors,
  handleInvalidRoutes,
} = require("./controllers/error-handling");

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.all("/*", handleInvalidRoutes);

app.use(handleCustomErrors);
app.use(handleInvalidRoutes);
app.use(handlePSQLerrors);
app.use(handleServerErrors);

module.exports = app;
