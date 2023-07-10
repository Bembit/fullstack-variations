var mongoose = require("mongoose");

var quickchatSchema = new mongoose.Schema({
    content: String,
    created: {type: Date, default: Date.now},
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String,
    avatar: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
    },
});

module.exports = mongoose.model("Quickchat", quickchatSchema);