const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateVideoInput(data) {
  let errors = {};

  data.videoTag = !isEmpty(data.videoTag) ? data.videoTag : "";

  if (!Validator.isLength(data.videoTag, { min: 2, max: 40 })) {
    errors.videoTag = "videoTag must be between 2 and 40 characters";
  }
  if (Validator.isEmpty(data.videoTag)) {
    errors.videoTag = "videoTag required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
