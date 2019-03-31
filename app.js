const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongoose set up
mongoose.connect(
  "mongodb://username:PASSWORD1@ds125616.mlab.com:25616/heroku_fvh448l3",
  {
    useNewUrlParser: true
  }
);
mongoose.connection.once("open", () => {
  console.log("connected to database");
});

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// test route
app.get("/", (req, res) => {
  res.send("the server is running");
});

//use routes
app.use("/api/users", users);

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`server running on ${port}`));
