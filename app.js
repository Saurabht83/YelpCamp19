var express           = require("express"),
    mongoose          = require("mongoose"),
    app               = express(),
    bodyParser        = require("body-parser"),
     methodOverride   = require("method-override"),
    Campground        = require("./models/campground"),
     Comment          = require("./models/comments"),
     seedDB           = require("./seeds"),
    passport          = require("passport"),
    User              = require("./models/user"),
    LocalStrategy     = require("passport-local"),
    eSession          = require("express-session");

var campRoutes        = require("./rotes/campground"),
    authRoutes        = require("./rotes/user"),
    commentRoutes     = require("./rotes/comments");

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/yelpcamp_db" ,{ useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
//seedDB();



//passport configuration
app.use(eSession({
 secret: "I love Ani very much ",
 resave: false,
 saveUninitialized: false 
 
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 next();
 
});



app.use(campRoutes);
app.use(authRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started...");
});




