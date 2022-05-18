// File containing functions used by express_server.js

const emailChecker = function (email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return user;
    }
  }
};

module.exports = { emailChecker };
