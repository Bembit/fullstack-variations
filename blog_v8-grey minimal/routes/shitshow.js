var express = require("express");
var router = express.Router();
var Shitshow = require("../models/shitshowdb");
var Quickchat = require("../models/quickchatdb");
var middlewareObj = require("../middleware/index.js");

// shitshow as the main page with forum posts
router.get("/shitshow", function(req, res) {
   if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      Shitshow.find({name: regex}, function(err, shitshow){
         if(err) {
            console.log(err);
         } else {
            res.render("posts/shitshow", {shitshow: shitshow});
         }
      });   
   } else {
         Shitshow.find({}, null, {sort: {created: -1}}, function(err, shitshow){
         if(err) {
            console.log(err);
         } else {
            res.render("posts/shitshow", {shitshow: shitshow});
         }
      });
   }
});

// shitshow post route (sending submit to /newpost)
router.post("/shitshow", middlewareObj.isLoggedIn, function(req, res) {
   // get the data from the form and add it to the shitshow array
   var name = req.body.name;
   var content = req.body.content;
   var created = req.body.created;
   var author = {
      id: req.user._id,
      username: req.user.username
   };
   //var created = req.body.created; , created: created
   var newPost = {name: name, content: content, created: created, author: author};
   //sanitize post
      //req.body.content = req.sanitize(req.body.content);
   //create new post and save to db
   Shitshow.create(newPost, function(err, newlyCreated) {
      if(err) {
         console.log(err);
      } else {
   //redirect back to shitshow
         res.redirect("shitshow");
      }
   });
});

router.get("/shitshow/:id", middlewareObj.isLoggedIn, function(req, res) {
   // find the post with id
      Shitshow.findById(req.params.id).populate("comments").exec(function(err, foundPost) {
         if(err) {
            console.log(err);
         } else {
            res.render("posts/show", {shitshow: foundPost});
         }
      });
});

// edit post
router.get("/shitshow/:id/edit", middlewareObj.checkPostOwnership, function(req, res) {
      Shitshow.findById(req.params.id, function(err, foundPost) {
               res.render("posts/edit", {shitshow: foundPost});
         });
});

router.put("/shitshow/:id", middlewareObj.checkPostOwnership, function(req, res) {
   //find and update the post
   Shitshow.findByIdAndUpdate(req.params.id, req.body.shitshow, function(err, updatedPost) {
      if(err) {
         res.redirect("/shitshow");
      } else {
         res.redirect("/shitshow/" + req.params.id);
      }
   });
});

// delete post
router.delete("/shitshow/:id", middlewareObj.checkPostOwnership, function(req, res) {
   Shitshow.findByIdAndRemove(req.params.id, function(err) {
      if(err) {
         res.redirect("/shitshow");
      } else {
         res.redirect("/shitshow");
      }
   });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); 
}

module.exports = router;