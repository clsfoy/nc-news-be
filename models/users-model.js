const connection = require("../db/connection");

exports.fetchUserByUsername = (userName) => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", userName)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
      return user;
    });
};

exports.patchUserInfo = ({ newName, newAvatar }, username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .update({ name: newName, avatar_url: newAvatar })
    .returning("*")
    .then((user) => {
      return user;
    });
};
