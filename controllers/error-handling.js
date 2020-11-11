const { request } = require("express");

const handleServerErrors = (err, req, res, next) => {
  res.status(500).send({
    mes: "Internal Server Error",
  });
};

const handlePSQLerrors = (err, req, res, next) => {
  const errorCodes = ["42703", "22P02"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({
      status: 400,
      msg: "Bad Request",
    });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({
      status: err.status,
      msg: err.msg,
    });
  } else {
    next(err);
  }
};

const send405 = (req, res, next) => {
  res.status(405).send({
    msg: "Oops...invalid method",
  });
};

const handleInvalidRoutes = (req, res, next) => {
  res.status(404).send({
    status: 404,
    msg: "Invalid Path - please see /api for available paths",
  });
};

module.exports = {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLerrors,
  send405,
  handleInvalidRoutes,
};
