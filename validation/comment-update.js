const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentUpdateInput(data) {
  let errors = {};

  data.message = !isEmpty(data.message) ? data.message : "";

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
