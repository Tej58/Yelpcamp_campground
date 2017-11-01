var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
    {
        name: "Teja's campground",
        image: "http://www.acadiamagic.com/280x187/md-campground.jpg",
        description: "A membership campground is a private campground and/or RV park open only to members. Members typically pay a one-time membership fee and annual dues (membership fees) for the right to use the campground. A membership campground can operate independently, selling memberships to customers who have access only to that individual property, or they can operate as part of a system, in which case members can buy access to multiple campgrounds. Membership campgrounds tend to be geared toward the owners of recreational vehicles, but often offer rental accommodations and spaces for tent camping."
        
    },
    {
        name: "Abhi's campground",
        image: "https://www.nps.gov/yell/planyourvisit/images/madison_4.jpg",
        description: "A membership campground is a private campground and/or RV park open only to members. Members typically pay a one-time membership fee and annual dues (membership fees) for the right to use the campground. A membership campground can operate independently, selling memberships to customers who have access only to that individual property, or they can operate as part of a system, in which case members can buy access to multiple campgrounds. Membership campgrounds tend to be geared toward the owners of recreational vehicles, but often offer rental accommodations and spaces for tent camping."
        
    },
     {
        name: "kp's campground",
        image: "http://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/10/main/hoodview-campground-0510.jpg?itok=B8Eb65Uf",
        description: "A membership campground is a private campground and/or RV park open only to members. Members typically pay a one-time membership fee and annual dues (membership fees) for the right to use the campground. A membership campground can operate independently, selling memberships to customers who have access only to that individual property, or they can operate as part of a system, in which case members can buy access to multiple campgrounds. Membership campgrounds tend to be geared toward the owners of recreational vehicles, but often offer rental accommodations and spaces for tent camping."
        
    }
    ]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
   if(err){
       console.log(err);
   } 
   else {
       console.log("remove campgrounds!!!");
      /* //Add Campgrounds
       data.forEach(function(seed){
          Campground.create(seed,function(err,campground){
              if(err){
                  console.log(err);
              }
              else{
                      console.log("campground added successfully!!");
                      //Add comments
                      Comment.create({
                          title: "This is a best campground I have ever visited",
                          author: "Navya"
                      },function(err,comment){
                          if(err){
                             console.log(err);
                          }
                          else {
                              campground.comments.push(comment);
                              campground.save();
                              console.log("comment added successfully!!");
                          }
                      });
              }
          }); 
       });*/
   }
});

 // Add few campgrounds
 //we cannot add here coz campgrounds may deleted by invoking remove after create
 
 //Add few comments
 //cannot add comments since they may be erased after invoking remove after creating commemts
}



module.exports = seedDB;