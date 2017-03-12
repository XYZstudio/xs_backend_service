// Module
const koa = require('koa');
const router = require('koa-router')();
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const genToken = require('../service/encrypt');
const app = koa();
const config = require('../config');
var Users = require('../database/schemas/users');

// Auth
passport.serializeUser(function(user, done) {
  done(null, user.email.toString());
});
passport.deserializeUser(function(id, done) {
  done(null, Users.findOne({ email: id }).exec(function(err, user){
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

// Reset and update user's password
// if the verification token and user email matches
router.post('/reset_password', function*() {
  const body = this.request.body;
  var user = null;
  try {
    const newToken = yield genToken(body.password, false);
    user = yield Users.findOne({ email: body.email, verify: body.token });
    if (user) {
      yield Users.update({ email: body.email, verify: body.token }, { password: newToken });
    } else {
      this.body = {
        error: true,
        message: '更新失败，请检查验证码是否正确'
      };
      return;
    }
  } catch(e) {
    console.error(err);
    this.status = 500;
  }

  this.body = {
    error: false,
    message: '成功更新了密码',
    user: user,
  };
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}