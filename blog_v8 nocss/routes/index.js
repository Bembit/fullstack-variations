const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userSchema");
const Posts = require("../models/postsSchema");

const middleware = require("../middleware/index.js");
const { isLoggedIn, checkPostOwnership, checkUserCredentials } = middleware;

router.get("/register", function(req, res) {
    res.render("register");
});

router.get("/login", function(req, res) {
   res.render("login");
});

router.post("/login", passport.authenticate("local",
   {
      successRedirect: "/",
      failureRedirect: "/login"
   }), function(req, res) {
         // req.flash("success", "logged you in");
});

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "logged you out");
   res.redirect("/");
});

router.post("/register", function(req, res) {
   const newUser = new User(
      {
         username: req.body.username,
         firstName: req.body.firstname,
         lastName: req.body.lastname,
         email: req.body.email,
         avatar: req.body.avatar
      }
   );
   User.register(newUser, req.body.password)
      .then(function(user) {
         passport.authenticate("local") (req, res, function() {
            req.flash("success", "You are now logged in!");
            res.redirect("/");
         });
      })
      .catch(function(err) {
         console.log(err);
         req.flash("error", "Username and / or email already registered.");
         res.redirect("/register");
      });
});

// refactor to user.js - put single user relevant routes there

// router.get("/users/:id", function(req, res) {
//    User.findById(req.params.id)
//       .then(function(foundUser) {
//          Posts.find().where('author.id').equals(foundUser._id).exec()
//             .then(function(posts){
               
//                res.render("users/show", {user: foundUser, posts: posts});
//             })
//             .catch(function(err) {
//                req.flash("error", "something went wrong");
//                res.redirect("/posts");      
//             });
//       })
//       .catch(function(err) {
//          console.error(err)
//          req.flash("error", "something went wrong");
//          res.redirect("/posts");
//       });
// });

// put it to separate component
// remove this and use above function, we don't need this after notes object will be on the user

// redirect to users/ + req.params.id

router.get("/users/:id", function(req, res) {
   User.findById(req.params.id)
      .then(function(foundUser) {
         Posts.find().where('author.id').equals(foundUser._id).exec()
            .then(function(posts) {
               res.render("users/show", {user: foundUser, posts: posts});
            })
            .catch(function(err) {
               req.flash("error", "something went wrong");
               console.log(err, "here")
               res.redirect("/posts");  
            })
      })
      .catch(function(err) {
         console.error(err)
         req.flash("error", "something went wrong");
         console.log(err, "here 3")
         res.redirect("/users/show");
      });
});

// edit profile route

router.get("/users/:id/edit", checkUserCredentials, function(req, res) {
   User.findById(req.params.id)
      .then(function(foundUser) {
         res.render("users/edit", {user: foundUser})
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("back")
         req.flash("error", "can't edit this post")
      });
});

// submit edit route

router.put("/users/:id", checkUserCredentials, function(req, res) {
   User.findByIdAndUpdate(req.params.id, req.body.user) 
      .then(function(updatedUser) {
         res.redirect("/users/" + req.params.id)
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("/users")
      })
});

module.exports = router;