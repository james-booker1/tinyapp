const express = require("express");
const app = express();
const PORT = 8080;
// const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const { getUserByEmail, urlsForUser } = require("./helper");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan());
app.set("view engine", "ejs");
// app.use(cookie());

app.use(
  cookieSession({
    name: "session",
    keys: ["monster", "munch", "rocks"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

app.get("/", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else res.redirect("/urls");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  console.log("users", users);
  if (!req.session.user_id) {
    return res.send("You need to be logging it to access this");
  }
  let userID = req.session.user_id;
  const user = users[userID];

  const templateVars = {
    users: user,
    urls: urlsForUser(userID, urlDatabase),
  };
  let newUserDatabase = urlsForUser(userID, urlDatabase);
  if (newUserDatabase) {
    res.render("urls_index", templateVars);
  }
});

//Generates random short URL
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.send("You need to be logging it to access this");
  }
  const shortURL = Math.random().toString(36).slice(2, 8);

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
    dateCreated: new Date(),
  };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  const templateVars = { urls: urlDatabase, users: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The page request was not found");
  }

  const templateVars = {
    users: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };

  res.render("urls_show", templateVars);
});

//LongURL updater, keeps the shortened URL but changes the long to a new website.
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The page request was not found");
  }
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// delete button in the index page
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    return res.send("You need to be logging it to access this");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Logout
app.post("/logout", (req, res) => {
  console.log("logout");
  req.session = null;
  res.redirect("/urls");
});
// Login

const users = {
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

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  const templateVars = { urls: urlDatabase, users: req.session.user_id };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const randomId = Math.random().toString(36).slice(2, 8);

  // if (!req.body.email || !req.body.password) {
  //   return res
  //     .status(404)
  //     .send("You need a password and username to continue - Try again");
  // }
  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send("This email already exists  - Try again");
  }
  users[randomId] = {
    id: randomId,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  req.session.user_id = randomId;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, users: req.session.user_id };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else
    return res
      .status(401)
      .send("Did you forget your password? Because this one isn't correct");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
