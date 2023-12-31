const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   avatar: String,
   firstName: String,
   lastName: String,
   email: { type: String,
            Unique: true,
   }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);