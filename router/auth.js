// Module
var koa = require('koa');
var router = require('koa-router')();
var passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
var app = koa();

// Config
const config = require('../config');

// Collection
var Users = require('../database/users');

// Auth
passport.serializeUser(function(user, done) {
  done(null, user._id.toString());
});
passport.deserializeUser(function(id, done) {
  done(null, Users.findOne({ _id: id }).exec(function(err, user){
    if(err){
      done(err, false);
    } else {
      done(null, user);
    }
  }));
});
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  Users.findOne({ email: email, status: 'active' }).exec(function(err, user){
    if(err) {
      done(null, false);
    }
    if(user) {
      user.comparePassword(password, function(err, isMatch){
        if(err) {
          console.error('Error:', err);
        }
        if(isMatch) {
          return done(null, user);
        }
        return done(null, false);
      });
    } else {
      return done(null, false);
    }
  });
}));

app.use(passport.initialize());
app.use(passport.session());

// Route
router.post(
  '/login_user',
  passport.authenticate('local', {}),
  function*() {
    this.status = 200;
    this.body = this.passport.user;
  }
);

router.get('/logout_user',function*(){
  this.logout();
  this.status = 200;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}