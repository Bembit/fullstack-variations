var express = require("express");
var router = express.Router();
var Quickchat = require("../models/quickchatdb");
var middlewareObj = require("../middleware/index.js");

// /quickchat temp
router.get("/quickchat", function(req, res) {
   Quickchat.find({}, null, {sort: {created: -1}}, function(err, quickchat){
      if(err) {
         console.log(err);
      } else {
         res.render("posts/quickchat", {quickchat: quickchat});
      }
   });
});

router.post("/quickchat", middlewareObj.isLoggedIn, function(req, res) {
   // get the data from the form and add it to the quickchat array
   var content = req.body.content;
   var created = req.body.created;
   var author = {
      id: req.user._id,
      username: req.user.username
   };

   var newChat = {content: content, created: created, author: author};

   //create newChat and save to db
   Quickchat.create(newChat, function(err, freshChat) {
      if(err) {
         console.log(err);
      } else {
   //redirect back to quickchat
         req.flash("success", "Post added, gg.");
         res.redirect("quickchat");
      }
   });
});

module.exports = router;