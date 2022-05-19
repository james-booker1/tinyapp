// File containing functions used by express_server.js

const req = require("express/lib/request");

const getUserByEmail = function (email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return undefined;
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

module.exports = { getUserByEmail, urlsForUser };
