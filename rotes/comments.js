var express = require("express");
var router = express.Router();
var Comment = require("../models/comments");
var Campground = require("../models/campground");
var middleware = require("../middleware");//we don't have to specifically write index.js after ../middleware 
                                              //because index.js file is autometically added if we just mention the directory name only.


//============================================
//Comments routes
//============================================
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,  function(req, res){
 Comment.findByIdAndRemove(req.params.comment_id, function(err){
  if(err){
   res.redirect("back");
  }
  else{
   res.redirect("/campgrounds/" + req.params.id);
  }
 });
 
});



 router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    var camp_id = req.params.id;
    Comment.findById(req.params.comment_id, function(err, foundComment){
     if(err){
         console.log(err);
         res.redirect("back");
     }
     else{
      
      res.render("comments/edit", {camp_id : camp_id, comment: foundComment});
     }
     
    });
 });


router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,  function(req, res){
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
       console.log(err);
       res.redirect("back");
      }else{
       console.log(updatedComment);
      res.redirect("/campgrounds/" + req.params.id); 
       
      }
      
     });
     
     
    });
  





router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
      Campground.findById(req.params.id, function(err, foundCamp){
       if(err){
        console.log(err);
        res.redirect("/campgrounds");
       }
       else{
        res.render("comments/new", {camp: foundCamp});
 
       }
       
      });
      
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
       if(err){
        console.log(err);
        res.redirect("/campgrounds");
       }
       else{
        Comment.create(req.body.comment, function(err, comment){
         if(err){
        console.log(err);
        res.redirect("/campgrounds");
         }
         else{
          
         comment.author.id = req.user._id;
         comment.author.username = req.user.username;
          comment.save();
          foundCamp.comments.push(comment);
          foundCamp.save();
           console.log("Your comment is added");
         res.redirect("/campgrounds/" + req.params.id);
         }
         
        });
       
        
       }
       
      });
      

});
module.exports = router;
