var express = require("express");
var router = express.Router();
var Shitshow = require("../models/shitshowdb");
var Comment = require("../models/commentdb");
var middlewareObj = require("../middleware/index.js");

router.post("/shitshow/:id/comments", middlewareObj.isLoggedIn, function(req, res){
   Shitshow.findById(req.params.id, function(err, shitshow) {
       if(err) {
         console.log(err);
         res.redirect("shitshow");
       } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err) {
               console.log(err);
            } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               shitshow.comments.unshift(comment);
               shitshow.save();
               res.redirect("/shitshow/" + shitshow._id);
            }
         });
       }
   });
});
//edit
router.get("/shitshow/:id/comments/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
         res.redirect("back");
      } else {
         res.render("posts/editcomment", {shitshow_id: req.params.id, comment: foundComment});
      }
   });
});
//update
router.put("/shitshow/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
      if(err) {
         res.redirect("back");
      } else {
         res.redirect("/shitshow/" + req.params.id) ;
      }
   });
});
//delete
router.delete("/shitshow/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if(err) {
         res.redirect("back");
      } else {
         res.redirect("/shitshow/" + req.params.id);
      }
   });
});

module.exports = router;