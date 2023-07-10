const Posts = require("../models/postsSchema");
const User = require("../models/userSchema");
const Comments = require("../models/commentSchema");

module.exports = {
   
   isLoggedIn: function(req, res, next) {
      if(req.isAuthenticated()) {
         return next();
      }
      req.flash("error", "Please log in first!");
      console.log(res.locals.error);
      res.redirect("/login");
   },
   
   checkPostOwnership: function(req, res, next) {
      if(req.isAuthenticated()) {
         Posts.findById(req.params.id, function(err, foundPost) {
            if(err) {
               req.flash("error", "Sorry. Post not found.");
               res.redirect("back");
            } else {
                  if (!foundPost) {
                     req.flash("error", "Stop doing that! Item not found.");
                     return res.redirect("back");
                  }
               if(foundPost.author.id.equals(req.user._id)) {
                  //needs an error handling for non existing post edit requests
                  next();
               } else {
                  req.flash("error", "something went wrong");
                  res.redirect("back");
               }
            }
         });
      } else {
         req.flash("error", "are you the owner of this post? if so please log in first");
         res.redirect("back");
      }
   },
   
   checkCommentOwnership: function(req, res, next) {
      if(req.isAuthenticated()) {
         Comments.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
               res.redirect("back");
            } else {
               if(foundComment.author.id.equals(req.user._id)) {
                  next();
               } else {
                  res.redirect("back");
               }
            }
         });
      } else {
         res.redirect("back");
      }
   },

   checkUserCredentials: function(req, res, next) {
      let currentUser = req.user;
      if(req.isAuthenticated()) {
         User.findById(req.params.id, function(err, foundUser) {
            if(err) {
               res.redirect("back");
            } else {
               if(foundUser._id.equals(currentUser.id)) {
                  next();
               } else {
                  req.flash("error", "can't edit other users profiles")
                  res.redirect("/users/" + req.params.id)
               }
            }
         });
      } else {
         res.redirect("back");
      }
   }

};