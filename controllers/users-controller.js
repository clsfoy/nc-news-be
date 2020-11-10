const dbConfig = require("../knexfile");
const { fetchUserByUsername } = require("../models/users-model");

const getUserByUsername = (req, res, next) => {
  const userName = req.params.username;
  fetchUserByUsername(userName)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getUserByUsername };
