const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.videoID = !isEmpty(data.videoID) ? data.videoID : "";
  data.timestamp = !isEmpty(data.timestamp) ? data.timestamp : "";
  data.message = !isEmpty(data.message) ? data.message : "";

  if (!Validator.isLength(data.videoID, { min: 2, max: 4 })) {
    errors.videoID = "videoID must be between 2 and 4 characters";
  }
  if (Validator.isEmpty(data.videoID)) {
    errors.videoID = "videoID required";
  }
  if (!Validator.isLength(data.timestamp, { min: 4, max: 5 })) {
    errors.timestamp = "timestamp must be between 4 and 5 characters";
  }
  if (Validator.isEmpty(data.timestamp)) {
    errors.timestamp = "timestamp required";
  }
  if (!Validator.isLength(data.message, { min: 2, max: 100 })) {
    errors.message = "comment message must be between 2 and 100 characters";
  }
  if (Validator.isEmpty(data.message)) {
    errors.message = "comment message required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
