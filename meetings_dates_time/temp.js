// router.get("/meetings/all", function(req, res) {
//    if(req.query.search) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi')
//       Meetings.find({name: regex})
//          .then(function() {
//             Meetings.find({content: regex}, function(err, results) {
//                if(results && results.length > 0) {
//                   console.log(results)
//                   res.render("/meetings/all", {meetings: results})
//                } else {
//                   console.log(results)
//                   res.send('that didn\'t work')
//                }
//             })
//          })
//          .catch(function(err) {
//             console.error(err)
//          })
//    } else {
//       Meetings.find({}, null, {sort: { created: -1 }})
//           .then(function(meetings) {
//               res.render("posts/allmeetings", {meetings: meetings});
//           })
//           .catch(function(err) {
//               console.error(err);
//           });
//    }
// })

// router.get("/meetings/all", function(req, res) {
//    if(req.query.search) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi')
//       Meetings.find({name: regex}, function(err, foundName) {
//               if(foundName && foundName.length !== 0 ) {
//                   console.log(foundName)
//                   res.render("posts/allmeetings", {meetings: foundName})
//               } else {
//                   Meetings.find({content: regex})
//                       .then(function(foundContent) {
//                            console.log(foundContent)
//                            res.render("posts/allmeetings", {meetings: foundContent})
//                       })
//                       .catch(function(err) {
//                           console.error(err)
//                       })
//               }
//       })
//    } else {
//       Meetings.find({}, null, {sort: { created: -1 }})
//           .then(function(meetings) {
//               res.render("posts/allmeetings", {meetings: meetings});
//           })
//           .catch(function(err) {
//               console.error(err);
//           });
//    }
// })

// router.get("/meetings/all", function(req, res) {
//     if(req.query.search) {
//        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
//        Meetings.find({name: regex}) && Meetings.find({content: regex})
//         .then(function(foundItems) {
//             res.render("/meetings/all", {meetings: foundItems})
//         })
//         .catch(function(err) {
//             console.error(err)
//         })
//     } else {
//         Meetings.find({}, null, {sort: { created: -1 }})
//         .then(function(meetings) {
//             res.render("posts/allmeetings", {meetings: meetings});
//         })
//         .catch(function(err) {
//             console.error(err);
//         });
//     }
// )};


    // $("#checkSlot").hover(function() {        
    //     $.ajax({url: "/api/meetings", success: function(meetings) {
    //         const date = document.getElementById("date").value
    //         const start = document.getElementById("startTime").value
    //         if((date === meetings.date) && ((start >= meetings.startTime) && (start <= meetings.finishTime))) {
    //             console.log('foglalt');
    //         } else {
    //             console.log('mehet');
    //         };
    //     }});
    // });

    
// let calendarResults = filter.map(function (meeting) {

//     const dateInput = document.getElementById("date").value
//     const startInput = document.getElementById("startTime").value

//     const alreadyBookedDates = meetings.map(({date, ...rest}) =>  ({date}))
//     const timeResults = alreadyBookedTimes.filter(item => item == startInput)

//     const alreadyBookedTimes = meetings.map(({startTime, ...rest}) => ({startTime}))
//     console.log(alreadyBookedTimes)

//     const isDateMatch = meeting.date.toString().includes(dateInput.toLowerCase())
//     const isTimeMatch = meeting.startTime.toString().toLowerCase().includes(startInput.toLowerCase())

//     return isDateMatch || isTimeMatch
// })


// $("#checkSlot").hover(function() {      
//         $.ajax({url: "/api/meetings", success: function(meetings) {

//             const dateInput = document.getElementById("date").value
//             const startInput = document.getElementById("startTime").value

//             meetings.map(function (meeting) {
//                 if((meeting.date == dateInput) && (dateInput.length > 0) && (((meeting.startTime == startInput) && (startInput.length > 0)) && ((meeting.finishTime > startInput) && (startInput.length > 0))   ) ) {
//                 // if((meeting.date == dateInput) && (dateInput.length > 0) && (((meeting.startTime == startInput) && (startInput.length > 0)) && ((meeting.finishTime > startInput) && (startInput.length > 0))   ) ) {
//                     // returns foglalt
//                     console.log('fogalt')
//                 } else {
//                     console.log('mehet')
//                 }
//             })
//     }});
// });


// let checkStartInput = meeting.filter((meeting) => (meeting.startTime >= startInput) && (meeting.startTime <= finishInput))    
    // meetings.map ... meetings
        // if meetings date == dateInput
        // .then( csak ha egyezik a datum az input datummal akkor menjen tovabb a kov logic checkre, ha nem akkor dobja el meg az elejen )


// $("#checkSlot").hover(function() {        
//     $.ajax({url: "/api/meetings", success: function(meetings) {
//         // meetings.forEach(item =>
//         //     console.log(item.date + ' ' + item.startTime + ' ' + item.finishTime)
//         // )
//         const alreadyBookedDates = meetings.map(({date, ...rest}) =>  ({date}))
//         console.log(alreadyBookedDates)

//         const alreadyBookedTimes = meetings.map(({startTime, ...rest}) => ({startTime}))
//         console.log(alreadyBookedTimes)

//         const dateInput = document.getElementById("date").value
//         const dateResults = alreadyBookedDates.filter(item => item == dateInput)
//         console.log(dateResults)

//         const startInput = document.getElementById("startTime").value
//         const timeResults = alreadyBookedTimes.filter(item => item == startInput)
//         console.log(timeResults)

//         // console.log(meetings)
//         // console.log(meetings[0].author)
//         // console.log(date)
//         // console.log(start)

//         if((date == meetings.date) && ((start >= meetings.startTime) && (start <= meetings.finishTime))) {
//             console.log('foglalt');
//         } else {
//             console.log('mehet');
//         };
//     }});
// });