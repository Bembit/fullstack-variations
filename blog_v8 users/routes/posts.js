const express = require("express");
const router = express.Router();
const Posts = require("../models/postsSchema");
const Comments = require("../models/commentSchema");
const middleware = require("../middleware/index.js");
const { isLoggedIn, checkPostOwnership } = middleware;


// quick api route setup for json to test ajax for calendar. if it works, write the backend js to fire when user finished picking all required dates / times
router.get("/api/posts", function(req, res) {
   Posts.find({}, null)
      .then(function(allPosts) {
         res.json(allPosts);
      })
      .catch(function(err) {
         console.error(err);
      });
});

// show limited amount of results on the main page and only for given day (today)
router.get("/posts", function(req, res) {
   
   let today = new Date();
   const dd = String(today.getDate()).padStart(2, '0');
   const mm = String(today.getMonth() + 1).padStart(2, '0');
   const yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;

   Posts.find({ date: today }, null, {limit: 5, skip: 0, sort: { created: -1 }})

   .then(function(posts) {
      res.render("posts/posts", {posts: posts});
   })
   .catch(function(err) {
      console.error(err);
   });
});

router.get("/posts/all/test", function(req, res) {
   Posts.find({}, null, {sort: {created: -1}})
      .then(function(posts) {
         res.render("posts/test", {posts: posts});
      })
      .catch(err => {
         console.log(err)
      })
})

// rewrite this to check both name and content for regex Posts.find 
// search bar
router.get("/posts/all", function(req, res) {
   if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi')
      Posts.find({name: regex}, function(err, foundName) {
              if(foundName && foundName.length !== 0 ) {
                  console.log(foundName)
                  res.render("posts/allposts", {posts: foundName})
              } else {
                  Posts.find({content: regex})
                      .then(function(foundContent) {
                           console.log(foundContent)
                           res.render("posts/allposts", {posts: foundContent})
                      })
                      .catch(function(err) {
                          console.error(err)
                      })
              }
      })
   } else {
      Posts.find({}, null, {sort: { created: -1 }})
          .then(function(posts) {
              res.render("posts/allposts", {posts: posts});
          })
          .catch(function(err) {
              console.error(err);
          });
   }
})

router.get("/posts/add", function(req, res) {
   res.render("posts/add");
});

router.post("/posts", isLoggedIn, function(req, res) {
   const date = req.body.date;
   const startTime = req.body.startTime;
   const finishTime = req.body.finishTime;
   const room = req.body.room;
   const name = req.body.name;
   const content = req.body.content;
   const created = req.body.created;
   const author = {
      id: req.user._id,
      username: req.user.username
   };
   const newPost = {date: date, startTime: startTime, finishTime: finishTime, room: room, name: name, content: content, created: created, author: author};

   Posts.create(newPost)
      .then(function(newlyCreatedPost) {
         res.redirect("posts/all");
      })
      .catch(function(err) {
         console.error(err);
      })
});

router.get("/posts/:id", isLoggedIn, function(req, res) {
   Posts.findById(req.params.id).populate("comments")
      .then(function(foundPost) {
         res.render("posts/show", {posts: foundPost});
      })
      .catch(function(err) {
         console.error(err);
      })           
});

router.get("/posts/:id/edit", checkPostOwnership, function(req, res) {
   Posts.findById(req.params.id)
      .then(function(foundPost) {
         res.render("posts/edit", {posts: foundPost})
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("back")
         req.flash("error", "can't edit this post")
      });
});

router.put("/posts/:id", checkPostOwnership, function(req, res) {
   Posts.findByIdAndUpdate(req.params.id, req.body.posts) 
      .then(function(updatedPost) {
         res.redirect("/posts/" + req.params.id)
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("/posts")
      })
});

// refine it to remove comments on deleting a posts
router.delete("/posts/:id", checkPostOwnership, function(req, res) {
   Posts.findByIdAndRemove(req.params.id)
      .then(function(posts) {
         Comments.remove({
            _id: {
               $in: req.posts.comments
            }
         })
         .then(function() {
            res.redirect("/posts");
         })
         .catch(function(err) {
            console.error(err)
            res.redirect("/posts")
         })
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("/posts");
      });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); 
}

module.exports = router;