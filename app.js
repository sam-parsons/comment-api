const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
// const profile = require("./routes/api/profile");
// const posts = require("./routes/api/posts");

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// test route
app.get("/", (req, res) => {
  res.send("this is the server");
});

//use routes
app.use("/api/users", users);

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`server running on ${port}`));
