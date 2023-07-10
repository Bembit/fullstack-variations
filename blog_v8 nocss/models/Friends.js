const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
   created: {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Friend", friendSchema);
