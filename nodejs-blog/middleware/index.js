
var Shitshow = require("../models/shitshowdb");
var Comment = require("../models/commentdb");


var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
   if(req.isAuthenticated()) {
      Shitshow.findById(req.params.id, function(err, foundPost) {
         if(err) {
            req.flash("error", "Sorry. Post not found.");
            res.redirect("back");
         } else {
            // block to check if post exists at all
               if (!foundPost) {
                  req.flash("error", "Stop doing that! Item not found.");
                  return res.redirect("back");
               }
            
            // does user own the post?
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
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
   if(req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment) {
         if(err) {
            res.redirect("back");
         } else {
            // does user own the post?
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
};

middlewareObj.isLoggedIn = function(req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   req.flash("error", "Please log in first!");
   console.log(res.locals.error);
   res.redirect("/login");
};

middlewareObj.denyAccess = function(req, res) {
   if(req.isAuthenticated()) {
      req.flash("error", "you are logged in, log out first to re-log or to register a new account");
      res.redirect("back");
   }
}

module.exports = middlewareObj;