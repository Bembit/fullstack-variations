const mongoose = require("mongoose");

// meetings database schema setup
const dateSchema = new mongoose.Schema({
   date: String,
   meeting: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meetings"
       }
   ]
});

module.exports = mongoose.model("Date", dateSchema);