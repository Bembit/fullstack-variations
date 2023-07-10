var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/userdb");
var Shitshow = require("../models/shitshowdb");
var Quickchat = require("../models/quickchatdb");
var middlewareObj = require("../middleware/index.js");

// landing is a login page only
router.get("/", function(req,res) {
   res.render("szelid");
});

//authentication routes
router.get("/register", function(req, res) {
    res.render("register");
});

//handle register (signup) logic
router.post("/register", function(req, res) {
   // we could use req.body instead of an object, but that captures the users password so... yeah.. no. don't
   var newUser = new User(
      {
         username: req.body.username,
         firstName: req.body.firstname,
         lastName: req.body.lastname,
         email: req.body.email,
         avatar: req.body.avatar
      }
   );
   User.register(newUser, req.body.password, function(err, user) {
      if(err) {
         console.log(err);
         req.flash("error", "Username and / or email already registered.");
         res.redirect("/register");
      } // remove this to avoid auto login after register
      passport.authenticate("local") (req, res, function() {
         req.flash("success", "You are now logged in sausage!");
         res.redirect("/shitshow");
      });
   });
});

//show login form - will move it to main szelid page later
router.get("/login", function(req, res) {
   res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local",
   {
      successRedirect: "/shitshow",
      failureRedirect: "/"
   }), function(req, res) {

});
//logout route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "logged you out");
   res.redirect("/");
});

// users public profile
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser) {
      if(err) {
         req.flash("error", "something went wrong");
         res.redirect("/shitshow");
      }
      Shitshow.find().where('author.id').equals(foundUser._id).exec(function(err, shitshow) {
      if(err) {
         req.flash("error", "something went wrong");
         res.redirect("/shitshow");      
         } else {
         res.render("users/show", {user: foundUser, shitshow: shitshow});
         }
      }); 
   });
});

module.exports = router;