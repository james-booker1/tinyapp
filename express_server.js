const express = require("express");
const app = express();
const PORT = 8080;
const cookie = require("cookie-parser");

const bodyParser = require("body-parser");
const { emailChecker } = require("./helper");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(cookie());
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  //console.log("users", users);
  const templateVars = { urls: urlDatabase, users: req.cookies["user_id"] };
  res.render("urls_index", templateVars);
});

//Generates random short URL
app.post("/urls", (req, res) => {
  const shortURL = Math.random().toString(36).slice(2, 8);

  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, users: req.cookies["user_id"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    users: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };

  res.render("urls_show", templateVars);
});
//edits the index page and redirects to the long URL changer on show
// app.get("/urls/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;

//   res.redirect(`/urls/${shortURL}`);
//   //res.redirect("urls_show");
// });
//LongURL updater, keeps the shortened URL but changes the long to a new website.
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// delete button in the index page
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Logout
app.post("/logout", (req, res) => {
  console.log("logout");
  res.clearCookie("user_id");
  res.redirect("/register");
});
// Login

app.get("/login", (res, req) => {
  res.render("urls_index.ejs");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(401).send("Wrong password - Try again");
  }
  res.cookie("username", username);
  res.redirect("/urls");
});

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
  const templateVars = { urls: urlDatabase, users: req.cookies["user_id"] };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const randomId = Math.random().toString(36).slice(2, 8);

  if (req.body.email === "" || req.body.password === "") {
    return res
      .status(404)
      .send("You need a password and username to continue - Try again");
  }
  if (emailChecker(req.body.email, users)) {
    return res
      .status(400)
      .send(
        "You need to choose a different username as this is regestered - Try again"
      );
  }
  users[randomId] = {
    id: randomId,
    email: req.body.email,
    password: req.body.password,
  };
  console.log("userdatabase=========", users);
  res.cookie("user_id", users[randomId]);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
