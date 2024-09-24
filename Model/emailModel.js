// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: false,
//     },
//     otp: {
//       type: String,
//       required: false,
//     },
//     token: {
//       type: String,
//       required: false,
//     },
//     refreshToken: {
//       type: String,
//       required: false,
//     },
//     loggedIn: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");

const Profile = require("../Model/userModel");
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
    userProfile: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.userId) {
    try {
      const profile = await Profile.findOne({ userId: this.userId });

      this.userProfile = profile ? true : false;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
