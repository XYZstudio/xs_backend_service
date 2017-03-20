// Module
const fs = require('fs');
const koa = require('koa');
const multipart = require('co-multipart');
const base64 = require('base-64');
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
      console.log('update_user_introduction: user not exist:' + user_name);
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
    "userId":           body.userId,
    "selfIntroduction": body.selfIntroduction,
    "myWebsite":        body.myWebsite,
    "weibo":            body.weibo,
    "qq":               body.qq,
    "Wechat":           body.Wechat,
    "tweeter":          body.tweeter,
    "facebook":         body.facebook, 
    "linkedin":         body.linkedin,
    "renren":           body.renren
  };
  var user_intro = yield Introductions.findOne({userName: user_name});
  if( user_intro == null ) {
    console.log('Creating new introduction...');
    intro = yield Introductions.create(intro);
  } else {
    console.log('updating exsiting introduction...');
    intro = yield Introductions.update({userName: user_name}, intro, {new: true});
    intro.update = true;
  }
  console.log('sucessfylly updated the instroction');
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

// post user icon
router.post('/save_icon', function*() {
  var parts = yield* multipart(this);
  var email = parts.field.userName;
  var icon_path = parts.file.file.path;
  var icon = fs.readFileSync(icon_path);
  var icon_type = parts.file.file.mimeType;
  icon = icon.toString('base64');

  try {
    yield Users.findOneAndUpdate({ email: email }, { $set: { icon: icon, icon_type: icon_type } });
    var user = yield Users.findOne({ email: email });
    this.body = user;
    return;
  } catch(e) {
    this.body = {
      error: true,
      response: "无法存储该头像"
    };
  }
});

// get user icon
router.get('/get_icon/:userName', function*() {
  var email = this.params.userName;

  try {
    var user = yield Users.findOne({ email: email });
    this.body = {
      icon: user.icon || '',
      icon_type: user.icon_type || ''
    };
    return;
  } catch(e) {
    this.body = {
      error: true,
      response: "无法提取该头像"
    };
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}