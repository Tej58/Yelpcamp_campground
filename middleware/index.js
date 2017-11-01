var campground = require("../models/campground");
var Comment    = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err,foundCampground){
           if(err || !foundCampground) {
               req.flash("error", "Sorry, that campground was not found");
               res.redirect("back");
           } 
           else {
                       if(foundCampground.author.id.equals(req.user._id)|| req.user.isAdmin){
                           next();
                       }
                       else {
                           req.flash("error", "you don't have permission to do that!");
                           res.redirect("back");
                       }
         }
        });
    }
    else {
        req.flash("error", "Please login first!!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,commentF){
           if(err ||!commentF) {
               req.flash("error","Sorry , that comment does not exist");
               res.redirect("back");
           } 
           else {
               if(commentF.author.id.equals(req.user._id)|| req.user.isAdmin){
                   next();
               }
               else {
                   req.flash("error", "you don't have permission to do that!");
                   res.redirect("back");
               }
           }
        });
    }
    else {
        req.flash("error", "Please login first!!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you must logged in!");
    res.redirect("/login");
};


module.exports = middlewareObj;