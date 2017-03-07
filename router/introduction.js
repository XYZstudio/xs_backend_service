// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var Introductions = require('../database/schemas/introduction');
var Users = require('../database/schemas/users');

// Route

// update introduction by email
router.post('/update_user_introduction', function*() {
  console.log("[router.introduction] POST: update_user_introduction");
  var body = this.request.body;
  var user_name = body.userName;
  var user;
  
  try {
    user = yield Users.find({email: user_name});
    if( user.length < 1 ) {
      this.body = {
        error: true, 
        response: "用户不存在"
      }
      return;
    }
  } catch(e) {
    this.status = 500;
    return;
  }

  var intro = {
    "userName":         user_name,
    "avatarPath":       body.avatarPath, 
    "selfIntroduction": body.selfIntroduction,
    "gender":           body.gender,
    "birthYear":        body.birthYear,
    "birthMonth":       body.birthMonth,
    "birthDate":        body.birthDate,
    "highestDegree":    body.highestDegree,
    "business":         body.business,
    "myWebsite":        body.myWebsite,
    "weibo":            body.weibo,
    "qq":               body.qq,
    "Wechat":           body.Wechat,
    "tweeter":          body.tweeter,
    "facebook":         body.facebook, 
    "linkedin":         body.linkedin,
    "renren":           body.renren,
    "hobbies":          body.hobbies
  };

  var user_intro = yield Introductions.findOne({userName: user_name});
  if( user_intro == null ) {
    intro = yield Introductions.create(intro);
  } else {
    intro = yield Introductions.update({userName: user_name}, intro, {new: true});
    intro.update = true;
  }
  

  this.body = intro;
  return;
});

// get introduction by email
router.get('/get_user_introduction/:userName', function*() {
  console.log("[router.introduction] GET: update_user_introduction");
  const user_name = this.params.userName;
  var intro;

  try {
    var user = yield Users.find({email: user_name});
    if( user.length < 1 ) {
      this.body = {
        error: true, 
        response: "用户不存在"
      }
      return;
    }
  } catch(e) {
    this.status = 500;
    return;
  }
  

  intro = yield Introductions.findOne({userName: user_name});

  if ( intro == null ) {
    this.body = {};
    return;
  }

  this.body = intro;
  return;
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}