const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userSchema");
const Meetings = require("../models/meetingsSchema");

const middleware = require("../middleware/index.js");
const { isLoggedIn, checkPostOwnership } = middleware;

router.get("/", function(req, res) {
   res.render("login");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.get("/login", function(req, res) {
   res.render("login");
});

router.post("/login", passport.authenticate("local",
   {
      successRedirect: "/meetings",
      failureRedirect: "/"
   }), function(req, res) {

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
            req.flash("success", "You are now logged in sausage!");
            res.redirect("/meetings");
         });
      })
      .catch(function(err) {
         console.log(err);
         req.flash("error", "Username and / or email already registered.");
         res.redirect("/register");
      });
});

router.get("/users/:id", function(req, res) {
   User.findById(req.params.id)
      .then(function(foundUser) {
         Meetings.find().where('author.id').equals(foundUser._id).exec()
            .then(function(meetings){
               res.render("users/show", {user: foundUser, meetings: meetings});
            })
            .catch(function(err) {
               req.flash("error", "something went wrong");
               res.redirect("/meetings");      
            });
      })
      .catch(function(err) {
         console.error(err)
         req.flash("error", "something went wrong");
         res.redirect("/meetings");
      });
});

module.exports = router;