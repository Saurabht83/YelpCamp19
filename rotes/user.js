var express = require("express");
var router = express.Router();
var Comment = require("../models/comments");
var Campground = require("../models/campground");
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("campgrounds/home");
    
});
//=============
//Auth routes
//=============

router.get("/register", function(req, res){
 
res.render("userAuth/register"); 
});

router.post("/register", function(req, res){
 var newUser = new User({username: req.body.username});
 User.register(newUser, req.body.password, function(err, user){
  if(err){
   console.log(err);
   return res.render("/userAuth/register");
  }
  
  passport.authenticate("local")(req, res, function(){
   res.redirect("/campgrounds");
 });
});
});

router.get("/login", function(req, res){
 
res.render("userAuth/login"); 
});


router.post("/login", passport.authenticate("local", {
 successRedirect : "/campgrounds",
 failureRedirect  : "/login"
 
}), function(req, res){
 
});


router.get("/logout", function(req, res){
 req.logout();
 res.redirect("/campgrounds");
});

// middleware to check whether a user is logged in or not

function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
  return next();
  
 }
 res.redirect("/login");
 
}

module.exports= router;
