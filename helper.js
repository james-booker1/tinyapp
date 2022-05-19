// File containing functions used by express_server.js

const findUserByEmail = function (email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return false;
};

const passwordChecker = function (password, userDatabase) {
  for (const pwd in userDatabase) {
    if (userDatabase[pwd].password === password) {
      return password;
    }
  }
};

const loggedInUser = function (email, userDatabase) {
  for (const key in userDatabase) {
    if (userDatabase[key].email === email) {
    }
  }
};

module.exports = { findUserByEmail, passwordChecker };
