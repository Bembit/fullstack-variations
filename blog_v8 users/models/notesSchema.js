const mongoose = require("mongoose");

// post db schema setup

const notesSchema = new mongoose.Schema({
   content: String,
   created : {type: Date, default: Date.now},
   // rework this for username Types.username;
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Notes", notesSchema);