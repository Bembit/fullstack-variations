var mongoose = require("mongoose");

// database schema setup
var shitshowSchema = new mongoose.Schema({
   name: String,
   content: String,
   created : {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
         }
      ]

});

module.exports = mongoose.model("Shitshow", shitshowSchema);