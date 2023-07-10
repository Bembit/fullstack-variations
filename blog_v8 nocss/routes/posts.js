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

router.get("/api/pagination", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Posts.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Posts.countDocuments();

    // let totalPages = Math.ceil(count / limit);
    // let currentPage = page

    // console.log(totalPages);
    // console.log(currentPage);

    // return res.render("posts/posts", {posts: posts});
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
});

// show limited amount of results on the main page and only for given day (today)
// ezzel mi lett

// router.get("/", function(req, res) {
   
//    let today = new Date();
//    const dd = String(today.getDate()).padStart(2, '0');
//    const mm = String(today.getMonth() + 1).padStart(2, '0');
//    const yyyy = today.getFullYear();
//    today = yyyy + '-' + mm + '-' + dd;

//    Posts.find({ date: today }, null, {limit: 5, skip: 0, sort: { created: -1 }})

//    .then(function(posts) {
//       res.render("posts/posts", {posts: posts});
//    })
//    .catch(function(err) {
//       console.error(err);
//    });
// });

router.get("/", function(req, res) {
   Posts.find({}, null, {limit: 6, skip: 0, sort: { created: -1 }})
      .then(function(posts) {
         res.render("posts/posts", {posts: posts});
      })
      .catch(function(err) {
         console.error(err);
      });
});

// rewrite this to check both name and content for regex Posts.find - this is a shitty function for now
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
         res.redirect("/");
      })
      .catch(function(err) {
         console.error(err);
      })
});

router.get("/posts/:id", isLoggedIn, function(req, res) {
   // added likes to populate
   Posts.findById(req.params.id).populate("comments likes")
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


// likes
// rewrite not to refresh
router.post("/posts/:id/like", isLoggedIn, function(req, res) {
   Posts.findById(req.params.id, function(err, foundPost) {
      if (err) {
         console.log(err);
         return res.redirect("/posts");
      }
      // check if the like already exists
      var foundUserLike = foundPost.likes.some(function (like) {
         return like.equals(req.user._id);
      });

      if (foundUserLike) {
         // if it does, user already liked, remove the like
         foundPost.likes.pull(req.user._id);
      } else {
         // if it doesn't, like it
         foundPost.likes.push(req.user);
      }

      foundPost.save(function(err) {
         if(err) {
            console.log(err);
            return res.redirect("/posts");
         } 
         return res.redirect("back");
      });

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

// refine it to remove comments on deleting a post
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