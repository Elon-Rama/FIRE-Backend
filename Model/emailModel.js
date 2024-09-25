const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;


