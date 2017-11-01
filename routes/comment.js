/*=============================================
            COMMENT ROUTES
===============================================*/
var express         = require("express"),
    router          = express.Router({mergeParams : true}),
    campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");
    

//New route for comments - form to display new comment for campground
router.get("/new",middleware.isLoggedIn, function(req, res) {
    //find campground by id
   campground.findById(req.params.id,function(err,campground){
       if(err){
           req.flash("error",err.message);
           console.log(err);
       }
       else {
           res.render("comments/new",{campground: campground});
       }
   });
    
});

router.post("/",middleware.isLoggedIn,function(req,res){
   //lookup campground using id
   campground.findById(req.params.id, function(err,campground){
      if(err){
          req.flash("error",err.message);
          console.log(err);
      } 
      else {
          Comment.create(req.body.comment, function(err,comment){
             if(err){
                 req.flash("error",err.message);
                 console.log(err);
             } 
             else {
                 comment.author.id = req.user._id;
                 comment.author.username=req.user.username;
                 comment.save();
                 campground.comments.push(comment);
                 campground.save();
                 console.log(comment);
                 req.flash("success","Comment added successfully");
                 res.redirect("/campgrounds/"+campground._id);
             }
          });
      }
   });
   //create a new comment
   //connect a new comment to campground
   //redirect to campground show page
});

//edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
          req.flash("error",err.message);
          res.redirect("back");
      }
      else {
          res.render("comments/edit", {campground_id: req.params.id ,comment : foundComment});
      }
   }); 
});


//update comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
           req.flash("error", err.message);
           res.redirect("back");
       }
       else {
           req.flash("success","Comment edited successfully!!!");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) 
});

//delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err,deletedComment){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success","Comment deleted successfully!!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });    
});



module.exports = router;