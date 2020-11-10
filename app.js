const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const dbConfig = "./knexfile.js";

app.use(express.json());
app.use("/api", apiRouter);

module.exports = app;
