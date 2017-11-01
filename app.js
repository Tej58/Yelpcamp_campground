var express                      = require("express"),
    app                          = express(),
    bodyParser                   = require("body-parser"),
    mongoose                     = require("mongoose"),
    passport                     = require("passport"),
    LocalStrategy                = require("passport-local"),
    passportLocalMongoose        = require("passport-local-mongoose"),
    methodOverride               = require("method-override"),
    flash                        = require("connect-flash"),
    campground                   = require("./models/campground"),
    Comment                      = require("./models/comment"),
    User                         = require("./models/user"),
    seedDB                       = require("./seeds");
    const session = require('express-session');
    const MongoStore = require('connect-mongo')(session);

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,    
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie:{maxAge: 180 * 60 * 1000}
    }));
    

    mongoose.connect(process.env.DATABASEURL);
    
//Requiring Routes

var campgroundRoutes            = require("./routes/campground"),
    commentRoutes               = require("./routes/comment"),
    indexRoutes                 = require("./routes/index");
    
    
/*campground.create({
    name: "Tejaswini", 
    image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
    description: "This is own by Tej! Fantastic campground with all facilities!!!"
}, function(err, campground){
    if(err){
        console.log(err);
    }
    else{
        console.log("Newly created campground");
        console.log(campground);
    }
});*/

//  var campgrounds = [,
//                       {name: "Abhinav", image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg"},
//                       {name: "Koduri", image: "https://farm7.staticflickr.com/6139/6016438964_f6b8e1fee2.jpg"}
//                     ];
                    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
   secret: "This yelpcamp is created by Tejaswini Koduri",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.locals.moment = require('moment');
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});



app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started running!!"); 
});