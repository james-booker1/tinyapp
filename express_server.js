const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
// Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(401).send("Wrong password - Try again");
  }
  res.cookie("username", username);
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };

  res.render("urls_show", templateVars);
});

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

//edits the index page and redirects to the long URL changer on show
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;

  res.redirect(`/urls/${shortURL}`);
});
// delete button in the index page
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const random = Math.random().toString(36).slice(2, 8);

  urlDatabase[random] = req.body.longURL;

  res.redirect(`/urls/${random}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
