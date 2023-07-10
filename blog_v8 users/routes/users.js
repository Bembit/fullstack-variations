const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");

const Notes = require("../models/notesSchema");
const User = require("../models/userSchema");

const { isLoggedIn } = middleware;


router.get("/api/users", isLoggedIn, function(req, res) {
    User.find({}, null)
       .then(function(allUsers) {
          res.json(allUsers);
          res.render("users", {users: users})
       })
       .catch(function(err) {
          console.error(err);
       });
 });

 router.get("/users", isLoggedIn, function(req, res) {
   User.find({}, null)
      .then(function(users) {
         res.render("users", {users: users})
      })
      .catch(function(err) {
         console.error(err);
      });
});

router.post("/:id", isLoggedIn, function(req, res) {

   const name = req.body.name;
   const content = req.body.content;
   const created = req.body.created;
   const author = {
      id: req.user._id,
      username: req.user.username
   };
   const newNote = {name: name, content: content, created: created, author: author};
   
   Notes.create(newNote)
      .then(function(newlyCreatedNote) {
         res.redirect("users/" + req.params.id);
      })
      .catch(function(err) {
         console.error(err);
      })
   });

 module.exports = router;