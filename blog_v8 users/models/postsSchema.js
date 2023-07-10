const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
   name: String,
   content: String,
   created : {type: Date, default: Date.now},
   // rework this for username Types.username;
   // unique username with hash 4444
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

module.exports = mongoose.model("Posts", postsSchema);