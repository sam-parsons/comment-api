const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  videos: [
    {
      videoTag: {
        type: String
      },
      comments: [
        {
          commentCreated: {
            type: Date,
            default: Date.now
          },
          timestamp: {
            type: String,
            required: true
          },
          message: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
