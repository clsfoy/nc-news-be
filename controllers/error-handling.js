const handleServerErrors = (err, req, res, next) => {
  res.status(500).send({
    mes: "Internal Server Error",
  });
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

module.exports = { handleCustomErrors, handleServerErrors };
