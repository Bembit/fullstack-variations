const express = require("express");
const router = express.Router();
const Posts = require("../models/postsSchema");
const Comments = require("../models/commentSchema");
const middleware = require("../middleware/index.js");
const { isLoggedIn, checkCommentOwnership } = middleware;

router.post("/posts/:id/comments", isLoggedIn, function(req, res){
   Posts.findById(req.params.id)
      .then(function(posts) {
         Comments.create(req.body.comment)
         .then(function(comment) {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();

            posts.comments.unshift(comment);
            posts.save();
            res.redirect("/posts/" + posts._id);
         })
         .catch(function(err) {
            console.error(err);
         });
      })
      .catch(function(err) {
         console.error(err);
         res.redirect("posts");
      });
});

router.get("/posts/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res) {
   Comments.findById(req.params.comment_id)
      .then(function(foundComment) {
         res.render("posts/editcomment", {posts_id: req.params.id, comment: foundComment});
      })
      .catch(function(err) {
         console.log(err)
         res.redirect("back");
      });
});

router.put("/posts/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
   Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment)
      .then(function(updatedComment) {
         // update edited time to be created time. or just a note as edited
         res.redirect("/posts/" + req.params.id) ;
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("back");
      });
});

router.delete("/posts/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
   Comments.findByIdAndRemove(req.params.comment_id)
      .then(function(removedComment) {
         res.redirect("/posts/" + req.params.id);
      })
      .catch(function(err) {
         console.error(err)
      });
});

module.exports = router;