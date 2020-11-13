const dbConfig = require("../knexfile");
const {
  fetchUserByUsername,
  patchUserInfo,
  fetchAllUsers,
} = require("../models/users-model");

const getUserByUsername = (req, res, next) => {
  const userName = req.params.username;
  fetchUserByUsername(userName)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};

const updateUserInfo = (req, res, next) => {
  const newUserInfo = req.body;
  const userName = req.params.username;

  patchUserInfo(newUserInfo, userName)
    .then((updatedUserInfo) => {
      res.status(201).send({ updatedUserInfo });
    })
    .catch(next);
};

module.exports = { getUserByUsername, updateUserInfo, getAllUsers };
