const express = require("express");
const router = express.Router();
const Meetings = require("../models/meetingsSchema");
const Comments = require("../models/commentSchema");
const middleware = require("../middleware/index.js");
const { isLoggedIn, checkPostOwnership } = middleware;


// quick api route setup for json to test ajax for calendar. if it works, write the backend js to fire when user finished picking all required dates / times
router.get("/api/meetings", function(req, res) {
   Meetings.find({}, null)
      .then(function(allMeetings) {
         res.json(allMeetings);
      })
      .catch(function(err) {
         console.error(err);
      });
});

// show limited amount of results on the main page and only for given day (today)
router.get("/meetings", function(req, res) {
   
   let today = new Date();
   const dd = String(today.getDate()).padStart(2, '0');
   const mm = String(today.getMonth() + 1).padStart(2, '0');
   const yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;

   Meetings.find({ date: today }, null, {limit: 5, skip: 0, sort: { created: -1 }})

   .then(function(meetings) {
      res.render("posts/meetings", {meetings: meetings});
   })
   .catch(function(err) {
      console.error(err);
   });
});

router.get("/meetings/all/test", function(req, res) {
   Meetings.find({}, null, {sort: {created: -1}})
      .then(function(meetings) {
         res.render("posts/test", {meetings: meetings});
      })
      .catch(err => {
         console.log(err)
      })
})

// rewrite this to check both name and content for regex Meetings.find - this is a shitty function for now
router.get("/meetings/all", function(req, res) {
   if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi')
      Meetings.find({name: regex}, function(err, foundName) {
              if(foundName && foundName.length !== 0 ) {
                  console.log(foundName)
                  res.render("posts/allmeetings", {meetings: foundName})
              } else {
                  Meetings.find({content: regex})
                      .then(function(foundContent) {
                           console.log(foundContent)
                           res.render("posts/allmeetings", {meetings: foundContent})
                      })
                      .catch(function(err) {
                          console.error(err)
                      })
              }
      })
   } else {
      Meetings.find({}, null, {sort: { created: -1 }})
          .then(function(meetings) {
              res.render("posts/allmeetings", {meetings: meetings});
          })
          .catch(function(err) {
              console.error(err);
          });
   }
})

router.get("/meetings/add", function(req, res) {
   res.render("posts/add");
});

router.post("/meetings", isLoggedIn, function(req, res) {
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
   const newMeeting = {date: date, startTime: startTime, finishTime: finishTime, room: room, name: name, content: content, created: created, author: author};

   Meetings.create(newMeeting)
      .then(function(newlyCreatedMeeting) {
         res.redirect("meetings/all");
      })
      .catch(function(err) {
         console.error(err);
      })
});

router.get("/meetings/:id", isLoggedIn, function(req, res) {
   Meetings.findById(req.params.id).populate("comments")
      .then(function(foundPost) {
         res.render("posts/show", {meetings: foundPost});
      })
      .catch(function(err) {
         console.error(err);
      })           
});

router.get("/meetings/:id/edit", checkPostOwnership, function(req, res) {
   Meetings.findById(req.params.id)
      .then(function(foundPost) {
         res.render("posts/edit", {meetings: foundPost})
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("back")
         req.flash("error", "can't edit this meeting")
      });
});

router.put("/meetings/:id", checkPostOwnership, function(req, res) {
   Meetings.findByIdAndUpdate(req.params.id, req.body.meetings) 
      .then(function(updatedPost) {
         res.redirect("/meetings/" + req.params.id)
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("/meetings")
      })
});

// refine it to remove comments on deleting a meeting
router.delete("/meetings/:id", checkPostOwnership, function(req, res) {
   Meetings.findByIdAndRemove(req.params.id)
      .then(function(meetings) {
         Comments.remove({
            _id: {
               $in: req.meetings.comments
            }
         })
         .then(function() {
            res.redirect("/meetings");
         })
         .catch(function(err) {
            console.error(err)
            res.redirect("/meetings")
         })
      })
      .catch(function(err) {
         console.error(err)
         res.redirect("/meetings");
      });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); 
}

module.exports = router;