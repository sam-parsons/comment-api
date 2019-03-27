const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
// const passport = require("passport");

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load user model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    user: "sample user",
    videos: [
      {
        videoID: "kjh5439dfdk4j5jh",
        comments: [
          {
            commentID: "lkjh543908dhjklh34",
            commentCreated: "August 04, 2018",
            commentTime: "2:31",
            commentContent:
              "this flute solo sucks and you are aweful, admit you have asthma and quit"
          },
          {
            commentID: "98745kgdjkhtds",
            commentCreated: "August 21, 2018",
            commentTime: "2:11",
            commentContent:
              "yeah, more vibrato right otherwise I'm going to fall asleep"
          }
        ]
      },
      {
        videoID: "kjh459djklh453452",
        comments: [
          {
            commentID: "mbadfiu794323948723",
            commentCreated: "August 24, 2018",
            commentTime: "0:31",
            commentContent:
              "yeah maybe you should just skip the repeats, I've got a movie to catch.  Have you ever seen Dune?"
          }
        ]
      }
    ]
  })
);

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //   check validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));

      //   bcrypt
    }
  });
});

// @route POST api/users/login
// @desc Login user / return JWT
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    }

    if (password == user.password) {
      return res.status(200).json({ message: "login successful" });
    } else {
      errors.password = "password incorrect";
      return res.status(400).json(errors);
    }

    // check password
    // bcrypt.compare(password, user.password).then(isMatched => {
    //   if (isMatched) {
    //     // user matched

    //     const payload = {
    //       id: user.id,
    //       name: user.name,
    //       avatar: user.avatar
    //     }; // create jwt payload

    //     // sign token
    //     jwt.sign(
    //       payload,
    //       keys.secretOrKey,
    //       { expiresIn: 3600 },
    //       (err, token) => {
    //         res.json({
    //           success: true,
    //           token: "Bearer " + token
    //         });
    //       }
    //     );
    //   } else {
    //     errors.password = "password incorrect";
    //     return res.status(400).json(errors);
    //   }
    // });
  });
});

// @route GET api/users/current
// @desc Return current user
// @access Private
// router.get(
//   "/current",
//   //   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json({
//       id: req.user.id,
//       name: req.user.name,
//       email: req.user.email
//     });
//   }
// );

// @route GET api/users/allusers
// @desc Return all users
// @access Public
router.get("/all", (req, res) => {
  User.find()
    // .populate("user", ["email", "password"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "there are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: "there are no profiles" }));
});

module.exports = router;
