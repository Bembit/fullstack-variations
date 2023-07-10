const express = require("express");
const router = express.Router();
const Meetings = require("../models/meetingsSchema");
const Comments = require("../models/commentSchema");
const middleware = require("../middleware/index.js");
const { isLoggedIn, checkCommentOwnership } = middleware;

router.post("/meetings/:id/comments", isLoggedIn, function(req, res){
   Meetings.findById(req.params.id)
      .then(function(meetings) {
         Comments.create(req.body.comment)
         .then(function(comment) {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();

            meetings.comments.unshift(comment);
            meetings.save();
            res.redirect("/meetings/" + meetings._id);
         })
         .catch(function(err) {
            console.error(err);
         });
      })
      .catch(function(err) {
         console.error(err);
         res.redirect("meetings");
      });
});

router.get("/meetings/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res) {
   Comments.findById(req.params.comment_id)
      .then(function(foundComment) {
         res.render("posts/editcomment", {meetings_id: req.params.id, comment: foundComment});
      })
      .catch(function(err) {
         console.log(err)
         res.redirect("back");
      });
});

router.put("/meetings/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
   Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment)
      .then(function(updatedComment) {
         res.redirect("/meetings/" + req.params.id) ;
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("back");
      });
});

router.delete("/meetings/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
   Comments.findByIdAndRemove(req.params.comment_id)
      .then(function(removedComment) {
         res.redirect("/meetings/" + req.params.id);
      })
      .catch(function(err) {
         console.error(err)
      });
});

module.exports = router;