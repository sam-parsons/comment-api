const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateVideoInput(data) {
  let errors = {};

  data.videoID = !isEmpty(data.videoID) ? data.videoID : "";

  if (!Validator.isLength(data.videoID, { min: 2, max: 4 })) {
    errors.videoID = "videoID must be between 2 and 4 characters";
  }
  if (Validator.isEmpty(data.videoID)) {
    errors.videoID = "videoID required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
