const mongoose = require("mongoose");

// meetings database schema setup
const meetingsSchema = new mongoose.Schema({
   date: String,
   startTime: String,
   finishTime: String,
   room: String,
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

module.exports = mongoose.model("Meetings", meetingsSchema);