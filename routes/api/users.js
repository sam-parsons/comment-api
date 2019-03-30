const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateVideoInput = require("../../validation/video");
const validateCommentInput = require("../../validation/comment");
const validateCommentUpdateInput = require("../../validation/comment-update");

// load user model
const User = require("../../models/User");

// TO-DO
// - PUT/update routes

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    message: "users route test successful"
  })
);

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  const email = req.body.email;
  const password = req.body.password;

  //   check validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
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
  User.findOne({ email })
    .then(user => {
      // check for user
      if (!user) {
        errors.email = "user not found";
        return res.status(404).json(errors);
      }

      // check password
      bcrypt.compare(password, user.password).then(isMatched => {
        if (isMatched) {
          // user matched

          const payload = {
            id: user.id,
            email: user.email
          }; // create jwt payload

          // sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          errors.password = "password incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch(err => res.status(404).json({ usernotfound: "user not found" }));
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

// DANGER WILL ROBINSON
// @route GET api/users/all
// @desc Return all users
// @access Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    User.find()
      .then(users => {
        if (!users) {
          errors.nousers = "there are no users";
          return res.status(404).json(errors);
        }
        res.json(users);
      })
      .catch(err => res.status(err));
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
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
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
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
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
  "/comment/:videoID/:commentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const videoID = req.params.videoID;
    const commentID = req.params.commentID;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
        const video = user.videos.filter(video => {
          return video.id === videoID;
        });
        const comments = video[0].comments;
        const comment = comments.filter(comment => {
          if (comment.id.toString() === commentID) return comment;
        });
        res.json(comment);
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
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
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
    User.findOne({ email })
      .then(user => {
        // check for user
        if (!user) {
          errors.email = "user not found";
          return res.status(404).json(errors);
        }

        user.videos.push({
          videoTag: req.body.videoTag
        });
        user.save();

        res.json({
          id: user.id,
          email: user.email,
          videoTag: user.videos[user.videos.length - 1].videoTag
        });
      })
      .catch(err => res.status(err));
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
      return res.status(400).json(errors);
    }

    const email = req.user.email;
    const videoID = req.params.videoID;

    // find user by email
    User.findOne({ email })
      .then(user => {
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
        // find video with videoID
        user.videos.forEach(video => {
          if (videoID === video.id) {
            video.comments.push({
              timestamp: req.body.timestamp,
              message: req.body.message
            });
          }
        });
        user.save();
        res.json(user);
      })
      .catch(err => res.status(err));
  }
);

// @route DELETE api/users/comment/:videoID/:commentID
// @desc delete comment on video
// @access Private
router.delete(
  "/comment/:videoID/:commentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const videoID = req.params.videoID;
    const commentID = req.params.commentID;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
        user.videos.forEach(video => {
          if (videoID === video.id) {
            const comments = video.comments.filter(
              comment => commentID !== comment.id
            );
            video.comments = comments;
            user.save();
            res.json(user);
          }
        });
      })
      .catch(err => res.status(err));
  }
);

// @route DELETE api/users/video/:videoID/
// @desc delete video by ID
// @access Private
router.delete(
  "/video/:videoID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const videoID = req.params.videoID;
    const email = req.user.email;
    const errors = {};

    User.findOne({ email })
      .then(user => {
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
        const videos = user.videos.filter(video => videoID !== video.id);
        user.videos = videos;
        user.save();
        res.json(user);
      })
      .catch(err => res.status(err));
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
    }).catch(err => res.json(err));
    res.status(200).json({ success: true });
  }
);

// @route PUT api/users/comment/:videoID/:commentID
// @desc updating message property of comment by IDs
// @access Private
router.put(
  "/comment/:videoID/:commentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentUpdateInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.user.email;
    const videoID = req.params.videoID;
    const commentID = req.params.commentID;
    const message = req.body.message;

    User.findOne({ email })
      .then(user => {
        if (!user) {
          errors.nouser = "user doesn't exist";
          return res.status(404).json(errors);
        }
        user.videos.forEach(video => {
          if (videoID === video.id) {
            const comment = video.comments.filter(
              comment => commentID === comment.id
            );
            comment[0].message = message;
            user.save();
            res.json(user);
          }
        });
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
