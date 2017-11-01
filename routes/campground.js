var express             = require("express"),
    router              = express.Router(),
    campground          = require("../models/campground"),
    middleware          = require("../middleware"),
    geocoder            = require('geocoder');
    
    
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});



//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var price = req.body.price;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//New route - form to display new campground
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW Route
router.get("/:id",function(req, res) {
    //find the campground with the rendered id 
    // render show that template with that campground 
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           req.flash("error",err.message);
           console.log(err);
       } 
       else
       {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
   
   // res.send("This will be the show page one day!");
});

//Edit campground -route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
   campground.findById(req.params.id,function(err,foundCampground){
          res.render("campgrounds/edit",{campground: foundCampground});
   }); 
});


//update campground route
router.put("/:id", function(req, res){
   
  geocoder.geocode(req.body.location, function (err, data) {
      if(err){
          console.log(err);
      }
      else {
          var name = req.body.name;
          var image = req.body.image;
          var desc = req.body.description;
          var author = {
              id: req.user._id,
              username: req.user.username
          }
          var price= req.body.price;
           var lat = data.results[0].geometry.location.lat;
           var lng = data.results[0].geometry.location.lng;
           var location = data.results[0].formatted_address;
           var newData = {name: name, price: price,location: location,lat: lat, lng: lng, image: image, description: desc, author: author};
           campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updateCampground){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success","Successfully Updated!");
                    res.redirect("/campgrounds/"+updateCampground._id);
                }
        });
      }
   
  });
});

//delete campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err, foundCampground){
       if(err){
           req.flash("error",err.message);
           res.redirect("/campgrounds");
       } 
       else {
           req.flash("success", foundCampground.name+" deleted successfully!!");
           res.redirect("/campgrounds");
       }
    });
});








module.exports = router;