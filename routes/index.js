var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile');
});
router.post('/register', function(req, res, next) {
  const data = new userModel({
    username:req.body.username,     //syntax-> name_in_userSchema:req.body.name_in_register.js
    email:req.body.email,
    contact:req.body.contact
  });
  userModel.register(data,req.body.password)  //retrive the password
  .then(function(registereduser){             //then save the password with the user and send user to profile page
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
});
router.post('/login',passport.authenticate('local',{    //It checks the password if match
  successRedirect: "/profile",      //send to profile
  failureRedirect: "/"              //or if fails send to start page
}), function(req, res, next) {});
router.get('/logout',function(req,res,next){  //it logouts the user
  req.logout(function(err){
    if(err){return next(err);}    //if any error occur then it throws error
    res.redirect('/login');      //if no error it send to start or login page
  })
})
function isLoggedIn(req,res,next){   //it is a middleware function,we can call this fuction anywhere when we have required to check if the user is logged in or not
  if(req.isAuthenticated()){       //if authenticate then we can go to the next page
    return next();
  }
  res.redirect('/');             //if not authenticate it send to start page
}
module.exports = router;