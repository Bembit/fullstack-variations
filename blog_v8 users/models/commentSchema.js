const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
   text: String,
   created: {type: Date, default: Date.now},
   // now i can send empty comments... set it to be min 5 chars
   // when not releasing enter comments won't stop populating the same input // well done
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Comment", commentSchema);