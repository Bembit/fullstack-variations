var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var moment = require("moment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/userdb");
//var expressSanitizer = require("express-sanitizer");

var commentRoutes = require("./routes/comments");
var shitshowRoutes = require("./routes/shitshow");
var authRoutes = require("./routes/index");
var quickRoutes = require("./routes/quickchat");

mongoose.connect("mongodb://localhost:27017/blog", { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressSanitizer()); //has to be after bodyParser
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

//PASSPORT config
app.use(require("express-session")({
    secret: "put something here in quotes",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//check for logged in user middleware
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authRoutes);
app.use(shitshowRoutes);
app.use(commentRoutes);
app.use(quickRoutes);

app.listen(4040, function() {
    console.log("server on, :4040");
});