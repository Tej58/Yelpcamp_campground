/*=======================================
        AUTH ROUTES
========================================*/
var express             = require("express"),
    router              = express.Router(),
    User                = require("../models/user"),
    passport            = require("passport"),
    Campground          = require("../models/campground"),
    async               = require("async"),
    crypto              = require("crypto");

router.get("/", function(req,res){
   res.render("landing");
});


// handle signup page
router.post("/register", function(req, res) {
    var newUser = new User({
         username: req.body.username,
         firstName: req.body.firstname,
         lastName: req.body.lastname,
         email: req.body.email,
         avatar: req.body.avatar
        });
        
    if(req.body.adminCode==="tejaswiniKoduri"){
        newUser.isAdmin = true;
    }
    
    User.register(newUser,req.body.password,function(err,user){
      if(err){
          console.log(err);
          return res.render("register",{"error": err.message});
      }
      passport.authenticate("local")(req,res,function(){
          req.flash("success", "Welcome to Yelpcamp!! "+user.username+" Nice to meet you!!");
          res.redirect("/campgrounds");
      });
   });
});


//handle login logic
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    
}),function(req, res) {
    
});

// handle logout logic
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success", "Logged out successfully!!");
   res.redirect("/campgrounds");
});


// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});


//USER PROFILES
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error","Something went wrong");
           res.redirect("/");
       }
       Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
     });
   }); 
});


// forgot password

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/campgrounds");
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne( { email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
       var api_key = 'key-dea8340bb08220ebab7603a346138ae9';
        var domain = 'sandbox8fb8164757984094aa0ba1f3097e25c1.mailgun.org';
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
        var data = {
          from: 'User <postmaster@sandbox8fb8164757984094aa0ba1f3097e25c1.mailgun.org>',
          to: user.email,
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
         
        mailgun.messages().send(data, function (error, body) {
            console.log('mail sent');
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(error, 'done');

        });

    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var api_key = 'key-dea8340bb08220ebab7603a346138ae9';
        var domain = 'sandbox8fb8164757984094aa0ba1f3097e25c1.mailgun.org';
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
        var data = {
          from: 'User <postmaster@sandbox8fb8164757984094aa0ba1f3097e25c1.mailgun.org>',
          to: user.email,
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
         mailgun.messages().send(data, function (error, body) {
           req.flash('success', 'Success! Your password has been changed.');
          done(error);

        });
     
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

module.exports = router;