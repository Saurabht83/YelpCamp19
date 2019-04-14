var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/campgrounds", function(req, res){
   Campground.find({}, function(err, campgrounds){
    if(err){
     console.log(err);
    } else{
     
      res.render("campgrounds/campgrounds", {campgrounds: campgrounds});
    }
    
   });
   
    
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
  var newCamp = req.body.camp;
  console.log(newCamp); console.log(req.user);
   newCamp.author = {
    username: req.user.username,
    id: req.user._id
   };
   
   Campground.create(newCamp, function(err, newCampground){
           if(err){
            console.log(err);
            
           }
    else{
     console.log(newCampground);
     res.redirect("./campgrounds");
     
    }
   });
   
});
  
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
   
    res.render("campgrounds/new");
    
});

router.get("/campgrounds/:id", function(req, res){
 
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
  if(err){
   console.log(err);
   
  }
  else{
   
   res.render("campgrounds/show", {camp: foundcamp});
   
   
  }
  
 });
 
 
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,  function(req, res){
 Campground.findById(req.params.id, function(err, foundCamp){
  
   res.render("campgrounds/edit", {camp: foundCamp});
   
  
  
  
 });
 
 
 router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp){
   if(err){
    
    console.log(err);
    res.redirect("/campgrounds");
   }else{
    
    res.redirect("/campgrounds/"+ req.params.id);
   }
   
  });
  
  
 });
 
 
 
});


router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
 Campground.findOneAndDelete(req.params.id, function(err){
  if(err){
   console.log(err);
  }
  res.redirect("/campgrounds");
//actually in both cases i.e. success or failurer, we want to redirect to the /campgrounds route. })
 
});
});


module.exports = router;
