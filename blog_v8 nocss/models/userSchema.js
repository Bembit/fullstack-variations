const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    Unique: true,
  },
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    Unique: true,
  },
  favourites: {},
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friend",
    },
  ],
  created: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);