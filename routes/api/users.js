const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateVideoInput = require("../../validation/video");
const validateCommentInput = require("../../validation/comment");

// load user model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    user: "sample user"
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
      const payload = {
        id: user.id,
        email: user.email
      }; // create jwt payload

      // sign token
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      });
      //   return res.status(200).json({ message: "login successful" });
    } else {
      errors.password = "password incorrect";
      return res.status(400).json(errors);
    }
  });
});

// @route GET api/users/current
// @desc Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  }
);

// @route GET api/users/all
// @desc Return all users
// @access Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      // .populate("user", ["email", "password"])
      .then(profiles => {
        if (!profiles) {
          errors.noprofiles = "there are no profiles";
          return res.status(404).json(errors);
        }
        res.json(profiles);
      })
      .catch(err =>
        res.status(404).json({ profiles: "there are no profiles" })
      );
  }
);

// @route GET api/users/video/all
// @desc Return all videos of a user
// @access Private
router.get(
  "/video/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        res.json(user.videos);
      })
      .catch(err => res.json(err));
  }
);

// @route GET api/users/video/:videoID
// @desc Return one video by ID
// @access Private
router.get(
  "/video/:videoID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const videoID = req.params.videoID;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        const video = user.videos.filter(video => {
          return video.id === videoID;
        });
        res.json(video);
      })
      .catch(err => res.json(err));
  }
);

// @route GET api/users/comment/:videoID/:commentID
// @desc Return one comment by IDs
// @access Private
router.get(
  "/video/:videoID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const videoID = req.params.videoID;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        const video = user.videos.filter(video => {
          return video.id === videoID;
        });
        res.json(video);
      })
      .catch(err => res.json(err));
  }
);

// @route GET api/users/comment/:videoID/
// @desc Return all comments on a video
// @access Private
router.get(
  "/comment/:videoID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const videoID = req.params.videoID;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        const video = user.videos.filter(video => {
          return video.id === videoID;
        });
        res.json(video[0].comments);
      })
      .catch(err => res.json(err));
  }
);

// @route POST api/users/video
// @desc add video to user
// @access Private
router.post(
  "/video",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateVideoInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    const email = req.user.email;

    // find user by email
    User.findOne({ email }).then(user => {
      // check for user
      if (!user) {
        errors.email = "user not found";
        return res.status(404).json(errors);
      }

      user.videos.push({
        videoID: req.body.videoID
      });
      user.save();

      res.json({
        id: user.id,
        email: user.email,
        videoID: user.videos[user.videos.length - 1].videoID
      });
    });
  }
);

// @route POST api/users/comment/:videoID
// @desc add comment to video of user
// @access Private
router.post(
  "/comment/:videoID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    const email = req.user.email;

    console.log(req.body);
    // find user by email
    User.findOne({ email }).then(user => {
      console.log(user);

      // find video with videoID
      user.videos.forEach(video => {
        if (req.body.videoID === video.videoID) {
          video.comments.push({
            timestamp: req.body.timestamp,
            message: req.body.message
          });
        }
      });
      user.save();
      res.json(user);
    });
  }
);

// @route DELETE api/users/comment/:videoID/:commentID
// @desc delete comment on video
// @access Private
router.delete(
  "/comment/:videoID/:commentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    User.findOne({ email: req.user.email }).then(user => {
      console.log(req.user);
      const video = user.videos.forEach(video => {
        if (req.params.videoID === video.videoID) {
          console.log("this one");
          console.log(video.comments);
          const comments = video.comments.filter(comment => {
            if (req.params.commentID !== comment.id) {
              console.log("inner loop");
              return comment;
            }
          });
          console.log(comments);
          video.comments = comments;
          console.log(video);
          user.save();
          res.json(user);
        }
      });
    });
  }
);

// @route DELETE api/users/comment/:videoID/:commentID
// @desc delete comment on video
// @access Private
router.delete(
  "/video/:videoID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    User.findOne({ email: req.user.email }).then(user => {
      console.log(req.user);
      const videos = user.videos.filter(video => {
        if (req.params.videoID !== video.videoID) {
          return video;
        }
      });
      user.videos = videos;
      user.save();
      res.json(user);
    });
  }
);

// @route DELETE api/users/
// @desc delete user
// @access Private
router.delete(
  "/:userID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.deleteOne({ _id: req.params.userID }, function(err) {
      if (err) return handleError(err);
    });
    res.status(200).json({ success: true });
  }
);

module.exports = router;
