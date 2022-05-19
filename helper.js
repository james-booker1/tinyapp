// File containing functions used by express_server.js

const req = require("express/lib/request");

const findUserByEmail = function (email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return false;
};

const urlsForUser = (id, database) => {
  let userURLs = {};

  for (const url in database) {
    if (id === database[url].userID) {
      userURLs[url] = database[url];
    }
  }

  return userURLs;
};

module.exports = { findUserByEmail, urlsForUser };
