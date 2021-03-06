const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.timestamp = !isEmpty(data.timestamp) ? data.timestamp : "";
  data.message = !isEmpty(data.message) ? data.message : "";

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
