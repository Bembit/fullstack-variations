const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
   date: String,
   startTime: String,
   finishTime: String,
   description: String,
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

module.exports = mongoose.model("Events", eventSchema);