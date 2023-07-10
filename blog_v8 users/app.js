const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const moment = require("moment");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/userSchema");
const expressSanitizer = require("express-sanitizer");

const commentRoutes = require("./routes/comments");
const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/index");
const userRoutes = require("./routes/users");

require('dotenv').config();

mongoose.set('debug', true);

 mongoose.connect(process.env.DB, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(console.log("mongodb connected successfully."))
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;

// mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/logindemo', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// });

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

const handlebars = require("express-handlebars");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authRoutes);
app.use(postsRoutes);
app.use(commentRoutes);
app.use(userRoutes);

app.listen(8080, function() {
    console.log("server on, :8080");
});