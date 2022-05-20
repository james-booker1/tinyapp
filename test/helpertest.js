const { assert } = require("chai");

const { getUserByEmail } = require("../helper.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, testUsers[expectedUserID]);
  });
  it("should return undefined when email doesnt exist", function () {
    const user = getUserByEmail("idontexist@nothappening.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});
